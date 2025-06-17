#!/bin/sh
set -e

echo "Starting cron service..."

if [ "$(id -u)" != "0" ]; then
  echo "Error: This script must be run as root"
  exit 1
fi

apk add --no-cache dcron

touch /app/cron.log
chown nextjs:nodejs /app/cron.log

echo "0 2 */2 * * cd /app && su -c 'npm run scrape:web >> /app/cron.log 2>&1' nextjs" > /etc/crontabs/root

echo "Running initial scraping job..."
cd /app && su -c 'npm run scrape:web >> /app/cron.log 2>&1' nextjs

crond -f -l 8