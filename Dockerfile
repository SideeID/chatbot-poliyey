# Stage 1: Build
FROM node:22-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV TZ=Asia/Jakarta

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from builder stage
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules

# Copy docs folder and scripts
COPY --from=builder /app/docs ./docs
COPY --from=builder /app/src ./src

# Create and set permissions for the scraping output directory
RUN mkdir -p ./scraped_docs
RUN chown -R nextjs:nodejs ./scraped_docs

USER nextjs

EXPOSE 3000

CMD ["npm", "start"]
