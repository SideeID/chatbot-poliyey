import { env } from './config';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { PineconeStore } from '@langchain/pinecone';
import { Pinecone } from '@pinecone-database/pinecone';
import { Document } from '@langchain/core/documents';

export async function embedAndStoreDocs(
  client: Pinecone,
  // @ts-ignore docs type error
  docs: Document<Record<string, any>>[],
) {
  try {
    const embeddings = new GoogleGenerativeAIEmbeddings();
    const index = client.Index(env.PINECONE_INDEX_NAME);

    // Tambahkan metadata default
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

    // Retriever dengan strategi Maximal Marginal Relevance (MMR)
    const retriever = vectorStore.asRetriever({
      searchType: 'mmr',
      searchKwargs: {
        fetchK: 6, // Ambil 6 teratas
        lambda: 0.5, // seimbangkan relevansi data
      },
    });

    // Fungsi Debugging Retrieval
    async function debugRetrieval(query: string) {
      const retrievedDocs = await retriever.getRelevantDocuments(query);

      console.log('Detailed Retrieval Insights:', {
        query,
        totalDocsRetrieved: retrievedDocs.length,
        retrievedDocs: retrievedDocs.map((doc, index) => ({
          index,
          source: doc.metadata.source,
          content: doc.pageContent.slice(0, 300),
        })),
      });

      return retrievedDocs;
    }

    // Fungsi Evaluasi Embedding
    async function evaluateEmbedding() {
      const testQueries = [
        'Informasi layanan di Politeknik Negeri Jember',
        'Peraturan akademik terbaru',
        'Prosedur pendaftaran mahasiswa',
        'Teaching Factory JTI Innovation',
        'Jurusan Teknologi Informasi',
      ];

      const evaluationResults = await Promise.all(
        testQueries.map(async (query) => {
          const retrievedDocs = await retriever.getRelevantDocuments(query);

          return {
            query,
            retrievedDocsCount: retrievedDocs.length,
            topRelevantSnippet: retrievedDocs[0]?.pageContent.slice(0, 400),
          };
        }),
      );

      console.log('Embedding Evaluation Results:', evaluationResults);
      return evaluationResults;
    }

    async function trackRAGPerformance(queries: string[]) {
      const performanceMetrics = await Promise.all(
        queries.map(async (query) => {
          const startTime = Date.now();
          const retrievedDocs = await retriever.getRelevantDocuments(query);
          const endTime = Date.now();

          return {
            query,
            retrievalTime: endTime - startTime,
            retrievedDocsCount: retrievedDocs.length,
          };
        }),
      );

      console.log('RAG Performance Metrics:', performanceMetrics);
      return performanceMetrics;
    }

    return {
      ...vectorStore,
      retriever,
      debugRetrieval,
      evaluateEmbedding,
      trackRAGPerformance,
    };
  } catch (error) {
    console.error('Vector Store Error:', error);
    throw new Error('Failed to initialize vector store with advanced features');
  }
}

// Fungsi utilitas untuk menjalankan evaluasi komprehensif
export async function runRAGEvaluation(vectorStore: any) {
  try {
    console.log('Starting RAG Evaluation...');

    const testQueries = [
      'Informasi layanan di Politeknik Negeri Jember',
      'Peraturan akademik terbaru',
      'Prosedur pendaftaran mahasiswa',
      'Teaching Factory JTI Innovation',
      'Jurusan Teknologi Informasi',
    ];

    // Debug Retrieval
    await Promise.all(
      testQueries.map((query) => vectorStore.debugRetrieval(query)),
    );

    // Evaluasi Embedding
    await vectorStore.evaluateEmbedding();

    // Track Performance
    await vectorStore.trackRAGPerformance(testQueries);

    console.log('RAG Evaluation Complete');
  } catch (error) {
    console.error('Comprehensive RAG Evaluation Failed:', error);
  }
}
