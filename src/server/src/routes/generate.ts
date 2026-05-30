import { Router, Request, Response, NextFunction } from 'express';

import { generateUIComponent } from '../services/gpt';
import { GenerateRequestSchema } from '../lib/types';

const router = Router();

router.post('/generate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const parsed = GenerateRequestSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Invalid request', details: parsed.error.flatten() });
      return;
    }

    const { transcript } = parsed.data;
    const result = await generateUIComponent(transcript);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
