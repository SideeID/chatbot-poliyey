import fs from 'fs/promises';
import path from 'path';

async function checkCronStatus() {
  try {
    const logFilePath = path.join(process.cwd(), 'logs', 'scraping-logs.txt');

    const fileExists = await fs
      .stat(logFilePath)
      .then(() => true)
      .catch(() => false);

    if (!fileExists) {
      console.log('No log file found. Cron job may not have run yet.');
      return;
    }

    const logContent = await fs.readFile(logFilePath, 'utf8');
    const logLines = logContent.trim().split('\n');

    if (logLines.length === 0) {
      console.log('Log file exists but is empty. No cron jobs have run yet.');
      return;
    }

    // Extract the last few log entries
    const lastEntries = logLines.slice(-10);
    console.log('Last 10 cron job log entries:');
    lastEntries.forEach((entry) => console.log(entry));

    // Check most recent run
    const lastEntry = logLines[logLines.length - 1];
    const lastRunMatch = lastEntry.match(/\[(.*?)\]/);
    if (lastRunMatch) {
      const lastRunTime = new Date(lastRunMatch[1]);
      const timeSinceLastRun = new Date().getTime() - lastRunTime.getTime();
      const daysSinceLastRun = timeSinceLastRun / (1000 * 60 * 60 * 24);

      console.log(`\nLast cron job ran on: ${lastRunTime.toLocaleString()}`);
      console.log(`Time since last run: ${daysSinceLastRun.toFixed(1)} days`);

      if (daysSinceLastRun > 3) {
        console.log("\nWARNING: Cron job hasn't run in over 3 days!");
      } else {
        console.log('\nCron job status: HEALTHY');
      }
    }
  } catch (error) {
    console.error('Error checking cron status:', error);
  }
}

checkCronStatus().catch(console.error);
