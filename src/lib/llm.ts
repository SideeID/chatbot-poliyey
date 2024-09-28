// import { ChatOpenAI } from "langchain/chat_models/openai";

// export const streamingModel = new ChatOpenAI({
//   modelName: "gpt-3.5-turbo",
//   streaming: true,
//   verbose: true,
//   temperature: 0,
// });

// export const nonStreamingModel = new ChatOpenAI({
//   modelName: "gpt-3.5-turbo",
//   verbose: true,
//   temperature: 0,
// });

import { ChatGoogleGenerativeAI } from '@langchain/google-genai';

export const streamingModel = new ChatGoogleGenerativeAI({
  model: 'gemini-1.5-flash',
  temperature: 0,
  maxRetries: 2,
  streaming: true,
  verbose: true,
});

export const nonStreamingModel = new ChatGoogleGenerativeAI({
  model: 'gemini-1.5-flash',
  temperature: 0,
  maxRetries: 2,
  verbose: true,
});
