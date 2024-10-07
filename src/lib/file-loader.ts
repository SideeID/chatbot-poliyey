import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

import { env } from './config';

export async function getChunkedDocsFromPDF() {
  try {
    const loader = new DirectoryLoader('./docs', {
      '.pdf': (path) =>
        new PDFLoader(path, {
          splitPages: true,
        }),
      '.txt': (path) => new TextLoader(path),
    });

    const docs = await loader.load();

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
      lengthFunction: (text) => text.length,
      separators: [
        // Custom separators untuk konten akademik
        '\n\n',
        '\n',
        '.',
        '!',
        '?',
        ';',
        ':',
        ' ',
        '',
      ],
    });

    const chunkedDocs = await textSplitter.splitDocuments(docs);

    // Tambahan preprocessing untuk membersihkan chunks
    const cleanedChunks = chunkedDocs.map((doc) => ({
      ...doc,
      pageContent: doc.pageContent
        .replace(/\s+/g, ' ') // Menghapus multiple spaces
        .replace(/[\r\n]+/g, ' ') // Menghapus line breaks
        .trim(), // Menghapus whitespace di awal/akhir
    }));

    return cleanedChunks;
  } catch (e) {
    console.error('Error details:', e);
    if (e instanceof Error) {
      throw new Error('PDF docs chunking failed: ' + e.message);
    } else {
      throw new Error('PDF docs chunking failed: ' + String(e));
    }
  }
}
