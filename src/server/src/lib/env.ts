import 'dotenv/config';

import { z } from 'zod';

const EnvSchema = z.object({
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
  PORT: z.coerce.number().default(3001),
  CLIENT_URL: z.string().url('CLIENT_URL must be a valid URL'),
  RATE_LIMIT_RPM: z.coerce.number().default(10),
  MAX_AUDIO_MB: z.coerce.number().default(25),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
