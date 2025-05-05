import z from 'zod';

// First attempt to load from process.env
const envSchema = z.object({
  GOOGLE_API_KEY: z.string().trim().min(1).optional(),
  GROQ_API_KEY: z.string().trim().min(1).optional(),
  PINECONE_API_KEY: z.string().trim().min(1).optional(),
  PINECONE_INDEX_NAME: z.string().trim().min(1).optional(),
  PINECONE_ENVIRONMENT: z.string().trim().min(1).optional(),
  INDEX_INIT_TIMEOUT: z.coerce.number().default(24000),
  MONGODB_URI: z.string().trim().min(1).optional(),
  SCRAPING_API_KEY: z.string().trim().min(1).optional(),
  NODE_ENV: z.string().default('development'),
  TZ: z.string().default('Asia/Jakarta'),
  CRON_SCHEDULE: z.string().default('0 2 */2 * *'),
  ENABLE_CRON: z.coerce.boolean().default(true),
  NODE_OPTIONS: z.string().default('--max-old-space-size=2048'),
});

// Handle parsing with fallbacks
const parsedEnv = envSchema.safeParse(process.env);

// Use parsed environment or defaults
export const env = parsedEnv.success
  ? parsedEnv.data
  : {
      GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || '',
      GROQ_API_KEY: process.env.GROQ_API_KEY || '',
      PINECONE_API_KEY: process.env.PINECONE_API_KEY || '',
      PINECONE_INDEX_NAME:
        process.env.PINECONE_INDEX_NAME || 'chatbot-poltek-v6',
      PINECONE_ENVIRONMENT: process.env.PINECONE_ENVIRONMENT || 'us-east-1',
      INDEX_INIT_TIMEOUT: parseInt(process.env.INDEX_INIT_TIMEOUT || '24000'),
      MONGODB_URI: process.env.MONGODB_URI || '',
      SCRAPING_API_KEY: process.env.SCRAPING_API_KEY || 'default-key',
      NODE_ENV: process.env.NODE_ENV || 'development',
      TZ: process.env.TZ || 'Asia/Jakarta',
      CRON_SCHEDULE: process.env.CRON_SCHEDULE || '0 2 */2 * *',
      ENABLE_CRON: process.env.ENABLE_CRON === 'true',
      NODE_OPTIONS: process.env.NODE_OPTIONS || '--max-old-space-size=2048',
    };

// Log environment status (safe to remove in production)
console.log(
  `Environment configuration ${
    parsedEnv.success ? 'loaded successfully' : 'using defaults'
  }`,
);

// Add a debug check function
export function isEnvValid() {
  const requiredForProduction = [
    'GOOGLE_API_KEY',
    'GROQ_API_KEY',
    'PINECONE_API_KEY',
  ];

  if (process.env.NODE_ENV === 'production') {
    const missing = requiredForProduction.filter(
      (key) => !env[key as keyof typeof env],
    );
    if (missing.length > 0) {
      console.warn(
        `Warning: Missing required environment variables in production: ${missing.join(
          ', ',
        )}`,
      );
      return false;
    }
  }

  return true;
}
