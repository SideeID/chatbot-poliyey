// src\lib\suggestions.ts
import { ChatGroq } from '@langchain/groq';
import { streamingModel, nonStreamingModel } from './llm';

const SUGGESTION_TEMPLATE = `Berdasarkan konteks percakapan sebelumnya, hasilkan 3-4 pertanyaan lanjutan yang relevan dan membantu pengguna untuk mendapatkan informasi lebih mendalam.

Riwayat Percakapan:
{chat_history}

Pertanyaan Terakhir: {last_question}
Jawaban Terakhir: {last_answer}

Panduan menghasilkan saran pertanyaan:
1. Pertanyaan harus terkait langsung dengan topik yang baru saja dibahas
2. Fokus pada detail tambahan atau aspek yang belum sepenuhnya dijawab
3. Gunakan bahasa yang sederhana dan mudah dipahami
4. Variasikan jenis pertanyaan (informasi, klarifikasi, contoh)

Hasilkan saran pertanyaan dalam format JSON array:
["Pertanyaan Saran 1", "Pertanyaan Saran 2", "Pertanyaan Saran 3"]`;

export async function generateLLMSuggestions(
  chatHistory: string,
  lastQuestion: string,
  lastAnswer: string,
): Promise<string[]> {
  try {
    const suggestionPrompt = SUGGESTION_TEMPLATE.replace(
      '{chat_history}',
      chatHistory,
    )
      .replace('{last_question}', lastQuestion)
      .replace('{last_answer}', lastAnswer);

    const suggestionModel = new ChatGroq({
      model: 'deepseek-r1-distill-llama-70b',
      temperature: 0.3,
      maxRetries: 2,
    });

    const response = await suggestionModel.invoke(suggestionPrompt);

    try {
      // Try parsing JSON response
      const suggestions = JSON.parse(response.content as string);
      return Array.isArray(suggestions) ? suggestions : [];
    } catch {
      // Fallback: try extracting suggestions from text
      const suggestionRegex = /"([^"]*)"/g;
      const matches = response.content?.toString().match(suggestionRegex) || [];
      return matches.map((match) => match.replace(/"/g, ''));
    }
  } catch (error) {
    console.error('Failed to generate suggestions:', error);
    return [];
  }
}
