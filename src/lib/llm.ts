import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

export const streamingModel = new ChatGoogleGenerativeAI({
  model: 'gemini-1.5-flash-8b',
  temperature: 0,
  maxRetries: 2,
  streaming: true,
  verbose: true,
});

export const nonStreamingModel = new ChatGoogleGenerativeAI({
  model: 'gemini-1.5-flash-8b',
  temperature: 0,
  maxRetries: 2,
  verbose: true,
});
