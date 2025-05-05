import fs from 'fs/promises';
import path from 'path';
import cron from 'node-cron';
import { scrapePolije } from '@/lib/web-loader';
import { embedAndStoreDocs } from '@/lib/vector-store';
import { getPineconeClient } from '@/lib/pinecone-client';
import { Pinecone } from '@pinecone-database/pinecone';

// Update the log file path to use logs directory
const LOG_FILE = path.join(process.cwd(), 'logs', 'scraping-logs.txt');

/**
 * Logs scraping activity with timestamp
 */
async function logScrapingActivity(message: string): Promise<void> {
  // Create logs directory if it doesn't exist
  try {
    await fs.mkdir(path.join(process.cwd(), 'logs'), { recursive: true });
  } catch (error) {
    // Ignore if directory already exists
  }

  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;

  try {
    await fs.appendFile(LOG_FILE, logMessage);
    console.log(message);
  } catch (error) {
    console.error('Error writing to log file:', error);
  }
}

/**
 * Cleans up the scraped_docs directory by removing all files
 */
async function cleanScrapedDocsFolder(): Promise<void> {
  const scrapedDocsPath = path.join(process.cwd(), 'scraped_docs');

  try {
    await fs.access(scrapedDocsPath);

    const files = await fs.readdir(scrapedDocsPath);

    for (const file of files) {
      const filePath = path.join(scrapedDocsPath, file);
      await fs.unlink(filePath);
    }

    await logScrapingActivity(
      `Cleaned ${files.length} files from scraped_docs folder`,
    );
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      await fs.mkdir(scrapedDocsPath, { recursive: true });
      await logScrapingActivity(
        'Created scraped_docs directory as it did not exist',
      );
    } else {
      await logScrapingActivity(
        `Error cleaning scraped_docs folder: ${(error as Error).message}`,
      );
      console.error('Error cleaning scraped_docs folder:', error);
    }
  }
}

/**
 * Updates data in Pinecone by:
 * 1. Menghapus semua data dari namespace
 * 2. Mengunggah kembali data PDF
 * 3. Menambahkan data hasil scraping website baru
 */
async function updateWebsiteData(pineconeClient: Pinecone): Promise<void> {
  try {
    const index = pineconeClient.Index(
      process.env.PINECONE_INDEX_NAME as string,
    );

    try {
      const namespace = index.namespace('polije-docs');
      await namespace.deleteAll();
      await logScrapingActivity(
        'Successfully deleted all data from Pinecone namespace',
      );

      await logScrapingActivity('Uploading PDF data back to Pinecone...');
      const { getChunkedDocsFromPDF } = await import('@/lib/file-loader');
      try {
        const pdfDocs = await getChunkedDocsFromPDF();
        if (pdfDocs && pdfDocs.length > 0) {
          await embedAndStoreDocs(pineconeClient, pdfDocs);
          await logScrapingActivity(
            `Successfully re-uploaded ${pdfDocs.length} PDF document chunks`,
          );
        } else {
          await logScrapingActivity('No PDF documents found to upload');
        }
      } catch (pdfError) {
        await logScrapingActivity(
          `Warning: Could not upload PDF data: ${(pdfError as Error).message}`,
        );
        console.error('Error processing PDF data:', pdfError);
      }
    } catch (error) {
      await logScrapingActivity(
        `Warning: Could not delete data from namespace: ${
          (error as Error).message
        }`,
      );
    }

    await cleanScrapedDocsFolder();

    await logScrapingActivity('Starting web scraping process...');
    const docs = await scrapePolije();
    await logScrapingActivity(
      `Scraped ${docs.length} document chunks from websites`,
    );

    await logScrapingActivity(
      `Embedding and storing ${docs.length} chunks in Pinecone...`,
    );
    await embedAndStoreDocs(pineconeClient, docs);

    await logScrapingActivity('Web data update completed successfully');
    return;
  } catch (error) {
    await logScrapingActivity(
      `Error updating website data: ${(error as Error).message}`,
    );
    console.error('Error updating website data:', error);
    throw error;
  }
}

/**
 * Main function to run the scraping job
 */
export async function runScrapingJob(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    await logScrapingActivity('Starting scheduled scraping job');

    const pineconeClient = await getPineconeClient();

    // Update website data
    await updateWebsiteData(pineconeClient);

    await logScrapingActivity('Scraping job completed successfully');
    return { success: true, message: 'Scraping job completed successfully' };
  } catch (error) {
    const errorMessage = `Scraping job failed: ${(error as Error).message}`;
    await logScrapingActivity(errorMessage);
    return { success: false, message: errorMessage };
  }
}

// Initialize cron job to run every 2 days at 2 AM
export function initCronJob(): void {
  cron.schedule('0 2 */2 * *', async () => {
    console.log('Running scheduled scraping job...');
    await runScrapingJob();
  });

  console.log(
    'Initialized cron job for web scraping (runs every 2 days at 2 AM)',
  );
}

export const scrapingService = {
  runManually: runScrapingJob,
};
