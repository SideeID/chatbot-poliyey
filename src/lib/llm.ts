// src\lib\llm.ts
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatGroq } from '@langchain/groq';

export const streamingModel = new ChatGroq({
  model: 'deepseek-r1-distill-llama-70b',
  temperature: 0.2,
  maxRetries: 2,
  streaming: true,
  verbose: true,
});

export const nonStreamingModel = new ChatGoogleGenerativeAI({
  model: 'gemini-1.5-flash',
  temperature: 0.2,
  maxRetries: 2,
  verbose: true,
});


// export const streamingModel = new ChatGoogleGenerativeAI({
//   model: 'gemini-1.5-flash',
//   temperature: 0.2,
//   maxRetries: 2,
//   streaming: true,
//   verbose: true,
// });

// export const nonStreamingModel = new ChatGroq({
//   model: 'deepseek-r1-distill-llama-70b',
//   temperature: 0.2,
//   maxRetries: 2,
//   verbose: true,
// });