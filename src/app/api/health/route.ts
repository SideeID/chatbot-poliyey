import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const logFilePath = path.join(process.cwd(), 'logs', 'scraping-logs.txt');

    // Check if cron service is working by looking at log file timestamps
    let cronStatus = 'unknown';
    let lastRunTime = 'never';

    try {
      const logContent = await fs.readFile(logFilePath, 'utf8');
      const logLines = logContent.trim().split('\n');

      if (logLines.length > 0) {
        const lastEntry = logLines[logLines.length - 1];
        const lastRunMatch = lastEntry.match(/\[(.*?)\]/);
        if (lastRunMatch) {
          lastRunTime = lastRunMatch[1];
          const lastRun = new Date(lastRunTime);
          const timeSinceLastRun = new Date().getTime() - lastRun.getTime();
          const daysSinceLastRun = timeSinceLastRun / (1000 * 60 * 60 * 24);

          cronStatus = daysSinceLastRun > 3 ? 'warning' : 'healthy';
        }
      }
    } catch (error) {
      cronStatus = 'not_running';
    }

    return NextResponse.json({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      cron: {
        status: cronStatus,
        lastRun: lastRunTime,
      },
    });
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json(
      { status: 'error', message: 'Health check failed' },
      { status: 500 },
    );
  }
}
