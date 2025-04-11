// src\app\api\chat\route.ts
import { NextRequest, NextResponse } from 'next/server';
import { callChain } from '@/lib/langchain';
import { Message } from 'ai';
import { checkProfanity } from '@/lib/profanity-filter';
import { StreamingTextResponse } from 'ai';

const formatMessage = (message: Message) => {
  return `${message.role === 'user' ? 'Human' : 'Assistant'}: ${
    message.content
  }`;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages: Message[] = body.messages ?? [];
    console.log('Messages ', messages);

    const latestMessage = messages[messages.length - 1];
    if (latestMessage.role === 'user') {
      const profanityCheck = checkProfanity(latestMessage.content);

      if (profanityCheck.isProfane) {
        const errorMessage =
          'Mohon maaf, saya tidak dapat memproses pesan yang mengandung kata-kata yang kurang sopan. JEMPOL dirancang untuk membantu dengan pertanyaan yang disampaikan dengan bahasa yang baik dan sopan. Silakan ajukan pertanyaan Anda kembali dengan bahasa yang lebih sopan. Terima kasih atas pengertian Anda.';

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
          start(controller) {
            controller.enqueue(encoder.encode(errorMessage));
            controller.close();
          },
        });

        return new StreamingTextResponse(stream);
      }
    }

    const formattedPreviousMessages = messages.slice(0, -1).map(formatMessage);
    const question = latestMessage.content;

    if (!question) {
      return NextResponse.json('Error: No question in the request', {
        status: 400,
      });
    }

    const streamingTextResponse = callChain({
      question,
      chatHistory: formattedPreviousMessages.join('\n'),
    });

    return streamingTextResponse;
  } catch (error) {
    console.error('Internal server error ', error);
    return NextResponse.json('Error: Something went wrong. Try again!', {
      status: 500,
    });
  }
}
