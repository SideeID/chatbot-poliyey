import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { env } from './config';

export async function getChunkedDocsFromPDF() {
  try {
    // const loader = new PDFLoader(env.PDF_PATH);
    const loader = new DirectoryLoader('./docs', {
      '.pdf': (path) => new PDFLoader(path),
      '.txt': (path) => new TextLoader(path),
    });

    const docs = await loader.load();
    // console.log(docs[0].metadata);

    // https://www.pinecone.io/learn/chunking-strategies/
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    const chunkedDocs = await textSplitter.splitDocuments(docs);

    return chunkedDocs;
  } catch (e) {
    console.error(e);
    throw new Error('PDF docs chunking failed !');
  }
}
