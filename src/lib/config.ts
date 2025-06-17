import z from 'zod';

const envSchema = z.object({
  GOOGLE_API_KEY: z.string().trim().min(1),
  GROQ_API_KEY: z.string().trim().min(1),
  PINECONE_API_KEY: z.string().trim().min(1),
  PINECONE_INDEX_NAME: z.string().trim().min(1),
  PINECONE_ENVIRONMENT: z.string().trim().min(1),
  INDEX_INIT_TIMEOUT: z.coerce.number().min(1),
  MONGODB_URI: z.string().trim().min(1),
  SCRAPING_API_KEY: z.string().trim().min(1).optional(),
  NODE_ENV: z.enum(['development', 'production']),
  TZ: z.string().default('Asia/Jakarta'),
  CRON_SCHEDULE: z.string().default('0 0 * * *'),
  ENABLE_CRON: z.coerce.boolean().default(false),
  NODE_OPTIONS: z.string().optional(),
});

export const env = envSchema.parse(process.env);
