import cors from 'cors';
import express, { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';

import { env } from './lib/env';
import healthRouter from './routes/health';
import transcribeRouter from './routes/transcribe';
import generateRouter from './routes/generate';

const app = express();

// ---- Middleware ----
app.use(cors({ origin: env.CLIENT_URL }));
app.use(express.json());

const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: env.RATE_LIMIT_RPM,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});

// ---- Routes ----
app.use('/api', healthRouter);
app.use('/api', apiLimiter, transcribeRouter);
app.use('/api', apiLimiter, generateRouter);

// ---- Error Handler ----
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.message);
  const status = (err as { status?: number }).status ?? 500;
  res.status(status).json({ error: err.message ?? 'Internal server error' });
});

export default app;
