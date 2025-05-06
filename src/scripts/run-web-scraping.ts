import { runScrapingJob } from '../services/cron-service';

(async () => {
  console.log('Starting manual web scraping job...');

  try {
    const result = await runScrapingJob();

    if (result.success) {
      console.log('✅ ' + result.message);
      process.exit(0);
    } else {
      console.error('❌ ' + result.message);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    process.exit(1);
  }
})();
