import { ConversationalRetrievalQAChain } from 'langchain/chains';
import { getVectorStore } from './vector-store';
import { getPineconeClient } from './pinecone-client';
import {
  StreamingTextResponse,
  experimental_StreamData,
  LangChainStream,
} from 'ai-stream-experimental';
import { streamingModel, nonStreamingModel } from './llm';
import { STANDALONE_QUESTION_TEMPLATE, QA_TEMPLATE } from './prompt-templates';
import dbConnect from './dbConnect';
import Question from '../models/Question';

type callChainArgs = {
  question: string;
  chatHistory: string;
};

export async function callChain({ question, chatHistory }: callChainArgs) {
  try {
    const sanitizedQuestion = question.trim().replaceAll('\n', ' ');
    await dbConnect();
    const savedQuestion = await Question.create({ content: sanitizedQuestion });
    const pineconeClient = await getPineconeClient();
    const vectorStore = await getVectorStore(pineconeClient);

    // Gunakan retriever kustom
    const retriever = vectorStore.retriever;
    retriever.searchType = 'mmr';
    retriever.searchKwargs = {
      fetchK: 6,
      lambda: 0.5,
    };

    //  debugging
    await vectorStore.debugRetrieval(sanitizedQuestion);

    // track RAG performance
    await vectorStore.trackRAGPerformance([sanitizedQuestion]);

    // Logging retrieval untuk setiap pertanyaan
    const retrievedDocs = await retriever.getRelevantDocuments(
      sanitizedQuestion
    );
    console.log('Retrieved Docs for Query:', {
      query: sanitizedQuestion,
      docsCount: retrievedDocs.length,
      docSources: retrievedDocs.map((doc) => doc.metadata.source),
      docChunks: retrievedDocs.map((doc) => doc.pageContent),
    });
    const { stream, handlers } = LangChainStream({
      experimental_streamData: true,
    });
    const data = new experimental_StreamData();

    const chain = ConversationalRetrievalQAChain.fromLLM(
      streamingModel,
      vectorStore.retriever,
      {
        qaTemplate: QA_TEMPLATE,
        questionGeneratorTemplate: STANDALONE_QUESTION_TEMPLATE,
        returnSourceDocuments: false,
        questionGeneratorChainOptions: {
          llm: nonStreamingModel,
        },
      }
    );

    // Question using chat-history
    // Reference https://js.langchain.com/docs/modules/chains/popular/chat_vector_db#externally-managed-memory
    chain
      .call(
        {
          question: sanitizedQuestion,
          chat_history: chatHistory,
        },
        [handlers],
      )
      .then(async (res) => {
        const isAnswered = !res.text
          .toLowerCase()
          .includes('maaf, saya belum memiliki informasi');

        await Question.findByIdAndUpdate(savedQuestion._id, {
          isAnswered: isAnswered,
          answer: res.text,
        });
        data.close();
      });

    // Return the readable stream
    return new StreamingTextResponse(stream, {}, data);
  } catch (e) {
    console.error(e);
    throw new Error('Call chain method failed to execute successfully!!');
  }
}
