// src\lib\pinecone-client.ts
import { Pinecone } from '@pinecone-database/pinecone';
import { env } from './config';
import { delay } from './utils';

let pineconeClientInstance: Pinecone | null = null;

async function createIndex(client: Pinecone, indexName: string) {
  try {
    await client.createIndex({
      name: indexName,
      dimension: 768,
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-east-1',
        },
      },
      deletionProtection: 'disabled',
    });
    console.log(
      `Waiting for ${env.INDEX_INIT_TIMEOUT} seconds for index initialization to complete...`
    );
    await delay(env.INDEX_INIT_TIMEOUT);
    console.log('Index created !!');
  } catch (error) {
    console.error('error ', error);
    throw new Error('Index creation failed');
  }
}

async function initPineconeClient() {
  try {
    const pineconeClient = new Pinecone({
      apiKey: env.PINECONE_API_KEY,
    });
    const indexName = env.PINECONE_INDEX_NAME;

    const existingIndexes = await pineconeClient.listIndexes();

    // Periksa apakah properti indeks ada dan merupakan sebuah array
    if (existingIndexes && Array.isArray(existingIndexes.indexes)) {
      if (
        !existingIndexes.indexes.map((index) => index.name).includes(indexName)
      ) {
        await createIndex(pineconeClient, indexName);
      } else {
        console.log('Index already exists');
      }
    } else {
      console.warn('No indexes found or indexes property is not an array.');
    }

    return pineconeClient;
  } catch (error) {
    console.error('error', error);
    throw new Error('Failed to initialize Pinecone Client');
  }
}

export async function getPineconeClient() {
  if (!pineconeClientInstance) {
    pineconeClientInstance = await initPineconeClient();
  }

  return pineconeClientInstance;
}
