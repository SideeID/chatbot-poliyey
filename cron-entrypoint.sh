#!/bin/sh

# Install crond
apk add --no-cache dcron

# Add crontab entry (runs at 2 AM every 2 days)
echo "0 2 */2 * * cd /app && node /app/src/scripts/run-web-scraping.ts >> /app/cron.log 2>&1" > /etc/crontabs/nextjs

# Give correct permissions
chmod 600 /etc/crontabs/nextjs

echo "Starting cron service..."

# Run initial scraping job
echo "Running initial scraping job..."
cd /app && node -r dotenv/config /app/src/scripts/run-web-scraping.ts >> /app/cron.log 2>&1

# Start cron daemon in foreground
crond -f -l 8
