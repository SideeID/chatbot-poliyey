import { NextRequest, NextResponse } from 'next/server';
import { scrapingService } from '@/services/cron-service';

export const dynamic = 'force-dynamic';

const API_KEY = process.env.SCRAPING_API_KEY;

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const providedApiKey = authHeader?.split(' ')[1];

    if (!providedApiKey || providedApiKey !== API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid or missing API key' },
        { status: 401 },
      );
    }

    const result = await scrapingService.runManually();

    if (result.success) {
      return NextResponse.json({ success: true, message: result.message });
    } else {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error('Error in scrape API route:', error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || 'Unknown error occurred',
      },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    const providedApiKey = authHeader?.split(' ')[1];

    if (!providedApiKey || providedApiKey !== API_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized. Invalid or missing API key' },
        { status: 401 },
      );
    }

    return NextResponse.json({
      message: 'Use POST method to manually trigger the scraping job',
      tip: 'Check server logs for detailed scraping history',
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || 'Unknown error occurred',
      },
      { status: 500 },
    );
  }
}
