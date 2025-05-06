#!/bin/sh
set -e

echo "Starting cron service..."

# Check if we're running as root
if [ "$(id -u)" != "0" ]; then
  echo "Error: This script must be run as root"
  exit 1
fi

# Install crond
apk add --no-cache dcron

# Create log file and set permissions
touch /app/cron.log
chown nextjs:nodejs /app/cron.log

# Add crontab entry (runs at 2 AM every 2 days)
echo "0 2 */2 * * cd /app && su -c 'node /app/src/scripts/run-web-scraping.ts >> /app/cron.log 2>&1' nextjs" > /etc/crontabs/root

# Run initial scraping job
echo "Running initial scraping job..."
cd /app && su -c 'node -r dotenv/config /app/src/scripts/run-web-scraping.ts >> /app/cron.log 2>&1' nextjs

# Start cron daemon in foreground
crond -f -l 8