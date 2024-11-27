import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

export async function getChunkedDocsFromPDF() {
  try {
    console.log('Starting document loading process...');
    const loader = new DirectoryLoader('./docs', {
      '.pdf': (path) => new PDFLoader(path),
      '.txt': (path) => new TextLoader(path),
    });

    const docs = await loader.load();
    console.log(`Loaded ${docs.length} documents successfully`);

    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 100,
      lengthFunction: (text) => text.length,
      separators: ['\n\n', '\n', '. ', '? ', '! ', '; ', ': ', ' - ', ', '],
    });

    function preprocessTableContent(text: string) {
      // Normalisasi konten tabel
      return text
        // .replace(/\|/g, ' ')
        .replace(/\n+/g, ' ') // Gabungkan baris
        .replace(/\s+/g, ' ') // Normalize whitespace
        .trim();
    }

    console.log('Starting document splitting process...');
    const chunkedDocs = await textSplitter.splitDocuments(docs);
    console.log(`Created ${chunkedDocs.length} chunks from documents`);

    console.log('Cleaning and processing chunks...');
    const cleanedChunks = chunkedDocs.map((doc) => ({
      ...doc,
      pageContent: preprocessTableContent(doc.pageContent),
    }));

    console.log(`Finished processing ${cleanedChunks.length} cleaned chunks`);

    return cleanedChunks;
  } catch (e) {
    console.error('Error in document processing:', e);
    if (e instanceof Error) {
      throw new Error('PDF docs chunking failed: ' + e.message);
    } else {
      throw new Error('PDF docs chunking failed: ' + String(e));
    }
  }
}
