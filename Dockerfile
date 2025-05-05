ARG NODE_VERSION=20.10.0

# Build stage
FROM node:${NODE_VERSION}-slim AS builder
WORKDIR /app

# Install dependencies needed for Puppeteer
RUN apt-get update && apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Install dependencies (only package.json and lock for cache efficiency)
COPY --link package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the rest of the application source
COPY --link . .

# Build the Next.js app (outputs to .next)
RUN --mount=type=cache,target=/root/.npm \
    npm run build

# Remove dev dependencies to reduce image size
RUN --mount=type=cache,target=/root/.npm \
    npm prune --production

# Production image
FROM node:${NODE_VERSION}-slim AS runner
WORKDIR /app

# Install Puppeteer dependencies in the runner image too
RUN apt-get update && apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN addgroup --system appgroup && adduser --system --ingroup appgroup appuser

# Create directories needed for the app with proper permissions
RUN mkdir -p /app/docs /app/dosen /app/scraped_docs \
    && chown -R appuser:appgroup /app

# Copy only necessary files from builder
COPY --from=builder --chown=appuser:appgroup /app/.next ./.next
COPY --from=builder --chown=appuser:appgroup /app/public ./public
COPY --from=builder --chown=appuser:appgroup /app/package.json ./
COPY --from=builder --chown=appuser:appgroup /app/package-lock.json ./
COPY --from=builder --chown=appuser:appgroup /app/node_modules ./node_modules
COPY --from=builder --chown=appuser:appgroup /app/next.config.js ./
COPY --from=builder --chown=appuser:appgroup /app/tailwind.config.cjs ./
COPY --from=builder --chown=appuser:appgroup /app/postcss.config.cjs ./

# Copy data directories
COPY --from=builder --chown=appuser:appgroup /app/docs ./docs
COPY --from=builder --chown=appuser:appgroup /app/dosen ./dosen
COPY --from=builder --chown=appuser:appgroup /app/scraped_docs ./scraped_docs

ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=2048"

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

USER appuser

EXPOSE 3000

CMD ["npm", "start"]
