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

type CallChainArgs = {
  question: string;
  chatHistory: string;
};

export async function callChain({ question, chatHistory }: CallChainArgs) {
  try {
    const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

    await dbConnect();
    const savedQuestion = await Question.create({ content: sanitizedQuestion });

    const pineconeClient = await getPineconeClient();
    const vectorStore = await getVectorStore(pineconeClient);

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
        returnSourceDocuments: true,
        questionGeneratorChainOptions: {
          llm: nonStreamingModel,
        },
      },
    );

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
          isAnswered,
          answer: res.text,
        });
        data.close();
      });

    return new StreamingTextResponse(stream, {}, data);
  } catch (e) {
    console.error(e);
    throw new Error('Call chain method failed to execute successfully');
  }
}
