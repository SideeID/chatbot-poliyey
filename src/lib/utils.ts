// src\lib\utils.ts
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

export function formattedText(text: string): string {
  return text.replace(/<think>([\s\S]*?)<\/think>/g, (_, content) => {
    const formattedContent = content.trim();

    return `\n\n\`\`\`think\n${formattedContent}\n\`\`\`\n\n`;
  });
}

export function generateSuggestions(lastMessage: string): string[] {
  const suggestionMap: { [key: string]: string[] } = {
    akademik: [
      'Jadwal Perkuliahan',
      'Informasi Jurusan',
      'Prosedur Akademik',
      'Pendaftaran KRS',
    ],
    dosen: ['Direktori Dosen', 'Kontak Dosen', 'Jadwal Konsultasi'],
    layanan: ['Prosedur Administrasi', 'Alur Pendaftaran', 'Biaya Kuliah'],
    kemahasiswaan: ['Kegiatan Mahasiswa', 'Beasiswa', 'Organisasi Kampus'],
  };

  const lowerMessage = lastMessage.toLowerCase();

  const matchedCategories = Object.keys(suggestionMap).filter((category) =>
    lowerMessage.includes(category),
  );

  if (matchedCategories.length === 0) {
    return [
      'Informasi Akademik',
      'Layanan Kemahasiswaan',
      'Jadwal Perkuliahan',
      'Prosedur Administrasi',
    ];
  }

  const suggestions = matchedCategories
    .flatMap((category) => suggestionMap[category])
    .slice(0, 4);

  return suggestions;
}

export const initialMessages: StreamMessage[] = [
  {
    role: 'assistant',
    id: '0',
    content: `Hai, Sobat POLIJE! 👋 Aku JEMPOL dari PINTU siap membantumu. Mau info apa hari ini? 
    Tanya aja langsung, ga usah ragu! Mulai dari akademik, layanan, sampai data dosen, semuanya aku bantu. Ayo, tembak pertanyaanmu! 🚀`,
  },
];
