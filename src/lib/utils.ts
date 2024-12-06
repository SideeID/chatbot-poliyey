import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Message as StreamMessage } from 'ai-stream-experimental/react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function scrollToBottom(containerRef: React.RefObject<HTMLElement>) {
  if (containerRef.current) {
    const lastMessage = containerRef.current.lastElementChild;
    if (lastMessage) {
      const scrollOptions: ScrollIntoViewOptions = {
        behavior: 'smooth',
        block: 'end',
      };
      lastMessage.scrollIntoView(scrollOptions);
    }
  }
}

// Reference:
// github.com/hwchase17/langchainjs/blob/357d6fccfc78f1332b54d2302d92e12f0861c12c/examples/src/guides/expression_language/cookbook_conversational_retrieval.ts#L61
export const formatChatHistory = (chatHistory: [string, string][]) => {
  const formattedDialogueTurns = chatHistory.map(
    (dialogueTurn) =>
      `Human: ${dialogueTurn[0]}\nAssistant: ${dialogueTurn[1]}`,
  );

  return formattedDialogueTurns.join('\n');
};

export function formattedText(inputText: string) {
  return inputText
    .replace(/\n\s*\n/g, '\n')
    .replace(/Berikut jawaban saya dalam format markdown:/g, '')
    .replace(/Berikut jawabannya dalam format markdown:/g, '')
    .replace(/Berikut jawaban dalam format markdown:/g, '')
}

export const initialMessages: StreamMessage[] = [
  {
    role: 'assistant',
    id: '0',
    content: `Hai, Sobat POLIJE! 👋 Aku JEMPOL dari PINTU siap membantumu. Mau info apa hari ini? 

    Tanya aja langsung, ga usah ragu! Mulai dari akademik, layanan, sampai data dosen, semuanya aku bantu. Ayo, tembak pertanyaanmu! 🚀`,
  },
];

// Ada yang bisa saya bantu hari ini? Berikut beberapa pertanyaan yang sering ditanyakan:
// 📚 "Apa saja layanan yang disediakan oleh PINTU?"
// 🎓 "Saya ingin meminjam gedung, bagaimana prosedur peminjamannya?"
// 📞 "Berikan saya data dari dosen Taufiq Rizaldi!"
// ❓ "Admin prodi di manajemen informatika?"
// Silakan ajukan pertanyaan Anda atau pilih salah satu topik di atas! 😊

interface Data {
  sources: string[];
}
