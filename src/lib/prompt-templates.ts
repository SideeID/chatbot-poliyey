export const STANDALONE_QUESTION_TEMPLATE = `Diberikan percakapan berikut dan pertanyaan lanjutan, ubahlah pertanyaan lanjutan tersebut menjadi pertanyaan yang mandiri.

Riwayat Percakapan:
{chat_history}
Input Pertanyaan Lanjutan: {question}
Pertanyaan Mandiri:`;


export const QA_TEMPLATE = `Anda adalah asisten AI yang antusias. 
Gunakan potongan konteks berikut untuk menjawab pertanyaan di bagian akhir.
Jika Anda tidak tahu jawabannya, katakan saja "Waduh gw juga gtw bro". 
JANGAN mencoba mengarang jawaban.
Jika pertanyaan tersebut tidak terkait dengan konteks, 
jawablah dengan sopan bahwa Anda disetel untuk hanya menjawab pertanyaan yang terkait dengan konteks.

{context}

Pertanyaan: {question}
Jawaban yang bermanfaat dalam format markdown:`;

