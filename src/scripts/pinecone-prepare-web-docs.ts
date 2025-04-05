// src\scripts\pinecone-prepare-web-docs.ts
import { scrapePolije } from '@/lib/web-loader';
import { embedAndStoreDocs } from '@/lib/vector-store';
import { getPineconeClient } from '@/lib/pinecone-client';

(async () => {
  try {
    const pineconeClient = await getPineconeClient();
    console.log('Sabar ya, masih scraping dan chunking data web...');
    const docs = await scrapePolije();
    console.log(`Loading ${docs.length} chunks ke pinecone...`);
    await embedAndStoreDocs(pineconeClient, docs);
    console.log('Web data embedded and stored in pinecone index');
  } catch (error) {
    console.error('Web data preparation script failed ', error);
  }
})();
