import { initCronJob } from './cron-service';

/**
 * Initialize all background services
 * This function should be called when the application starts
 */
export function initializeServices(): void {
  // Initialize the cron job for web scraping
  initCronJob();

  console.log('All background services initialized');
}
