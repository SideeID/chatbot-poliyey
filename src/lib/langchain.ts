import { ConversationalRetrievalQAChain } from 'langchain/chains';
import {
  ChatPromptTemplate,
  HumanMessagePromptTemplate,
  SystemMessagePromptTemplate,
} from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
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

const FOLLOW_UP_SUGGESTIONS_TEMPLATE = ChatPromptTemplate.fromMessages([
  SystemMessagePromptTemplate.fromTemplate(`
    Anda adalah seorang ahli dalam menghasilkan pertanyaan lanjutan yang relevan berdasarkan konteks percakapan sebelumnya.
    Pertimbangkan pertanyaan asli pengguna dan jawaban yang diberikan untuk menyarankan 3-4 pertanyaan lanjutan yang mendalam.
    Saran-saran ini harus:
    - Langsung terkait dengan percakapan sebelumnya
    - Mengeksplorasi topik dari sudut pandang yang berbeda
    - Jelas dan ringkas
    - Sesuai untuk konteks spesifik
    - Menggunakan nada percakapan dan membantu
  `),
  HumanMessagePromptTemplate.fromTemplate(`
    Konteks Sebelumnya:
    Pertanyaan: {question}
    Jawaban: {answer}

    Silakan buat 3-4 pertanyaan lanjutan potensial yang mungkin ingin ditanyakan pengguna selanjutnya.
    Balas HANYA dengan array JSON dari string, seperti: 
    ["Pertanyaan Lanjutan 1", "Pertanyaan Lanjutan 2", "Pertanyaan Lanjutan 3"]
  `),
]);

export async function generateFollowUpSuggestions(
  question: string,
  answer: string,
) {
  try {
    const suggestionChain = FOLLOW_UP_SUGGESTIONS_TEMPLATE.pipe(
      nonStreamingModel,
    ).pipe(new StringOutputParser());

    let suggestionsJson = await suggestionChain.invoke({
      question,
      answer,
    });

    // Clean up the suggestions text
    suggestionsJson = suggestionsJson
      .replace(/```json/g, '') // Remove ```json
      .replace(/```/g, '') // Remove ```
      .replace(/\n/g, '') // Remove newlines
      .trim(); // Remove leading/trailing whitespace

    // Parse the JSON response
    try {
      const suggestions = JSON.parse(suggestionsJson);

      return Array.isArray(suggestions)
        ? suggestions.filter(
            (s) => typeof s === 'string' && s.trim().length > 0,
          )
        : [];
    } catch (parseError) {
      console.error(
        'Failed to parse suggestions:',
        parseError,
        'Raw text:',
        suggestionsJson,
      );

      const defaultSuggestions = suggestionsJson
        .split(/["\n]/)
        .filter(
          (suggestion) =>
            suggestion.trim().length > 5 &&
            !suggestion.includes('[') &&
            !suggestion.includes(']'),
        )
        .slice(0, 3);

      return defaultSuggestions;
    }
  } catch (error) {
    console.error('Error generating follow-up suggestions:', error);
    return [];
  }
}

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

        // Update the question in the database
        const updatedQuestion = await Question.findByIdAndUpdate(
          savedQuestion._id,
          {
            isAnswered,
            answer: res.text,
          },
          { new: true },
        );

        // Generate follow-up suggestions
        const followUpSuggestions = await generateFollowUpSuggestions(
          sanitizedQuestion,
          res.text,
        );

        // Add suggestions to the stream data
        data.append({
          type: 'follow-up-suggestions',
          suggestions: followUpSuggestions,
        });

        data.close();
      });

    return new StreamingTextResponse(stream, {}, data);
  } catch (e) {
    console.error(e);
    throw new Error('Call chain method failed to execute successfully');
  }
}
