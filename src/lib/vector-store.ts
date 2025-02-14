// src\lib\vector-store.ts
import { env } from './config';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { PineconeStore } from '@langchain/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
import { Document } from '@langchain/core/documents';

export async function embedAndStoreDocs(
  client: Pinecone,
  docs: Document<Record<string, any>>[],
) {
  try {
    const embeddings = new GoogleGenerativeAIEmbeddings();
    const index = client.Index(env.PINECONE_INDEX_NAME);

    const processedDocs = docs.map((doc) => ({
      ...doc,
      metadata: {
        ...doc.metadata,
        source_type: 'polije_document',
        processed_at: new Date().toISOString(),
      },
    }));

    await PineconeStore.fromDocuments(processedDocs, embeddings, {
      pineconeIndex: index,
      textKey: 'text',
      namespace: 'polije-docs',
    });
  } catch (error) {
    console.error('Embedding Error:', error);
    throw new Error('Failed to load documents into vector store!');
  }
}

export async function getVectorStore(client: Pinecone) {
  try {
    const embeddings = new GoogleGenerativeAIEmbeddings();
    const index = client.Index(env.PINECONE_INDEX_NAME);

    const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
      pineconeIndex: index,
      textKey: 'text',
      namespace: 'polije-docs',
    });

    const retriever = vectorStore.asRetriever({
      searchType: 'mmr',
      searchKwargs: {
        fetchK: 6,
        lambda: 0.5,
      },
    });

    return { ...vectorStore, retriever };
  } catch (error) {
    console.error('Vector Store Error:', error);
    throw new Error('Failed to initialize vector store');
  }
}
