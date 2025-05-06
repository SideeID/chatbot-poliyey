# Docker Deployment Guide for JEMPOL

## Prerequisites

- Docker and Docker Compose installed on your VPS
- At least 4GB RAM available on your server

## Deployment Steps

1. Clone the repository to your VPS

   ```bash
   git clone <repository-url>
   cd MIF_E31221308
   ```

2. Make the cron entrypoint script executable

   ```bash
   chmod +x cron-entrypoint.sh
   ```

3. Create or edit `.env` file with your environment variables (use the example provided)

   ```bash
   nano .env
   ```

4. Build and start the Docker containers

   ```bash
   docker-compose up -d
   ```

5. Check the logs to ensure everything is running correctly

   ```bash
   docker-compose logs -f
   ```

6. The application should now be available at `http://your-vps-ip:3000`

## Managing the Application

- To stop the application:

  ```bash
  docker-compose down
  ```

- To update the application after code changes:

  ```bash
  git pull
  docker-compose down
  docker-compose up -d --build
  ```

- To view logs:

  ```bash
  # All logs
  docker-compose logs -f

  # App logs only
  docker-compose logs -f app

  # Cron logs only
  docker-compose logs -f cron
  ```

- To manually trigger web scraping:

  ```bash
  docker-compose exec app npm run scrape:web
  ```

- To check scraping logs:
  ```bash
  docker-compose exec cron cat /app/cron.log
  ```

## Troubleshooting

- If you encounter memory issues, adjust the memory limits in docker-compose.yml
- If cron jobs aren't running, check the cron logs and ensure ENABLE_CRON is properly set
- For any database connection issues, verify your MongoDB URI in the .env file
