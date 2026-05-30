import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';

import { transcribeAudio } from '../services/whisper';
import { env } from '../lib/env';

const router = Router();

// Store uploads in memory — never write audio to disk
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: env.MAX_AUDIO_MB * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['audio/webm', 'audio/wav', 'audio/mp4', 'video/webm'];
    if (allowed.some((type) => file.mimetype.startsWith(type.split('/')[0]))) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported audio format: ${file.mimetype}`));
    }
  },
});

router.post(
  '/transcribe',
  upload.single('audio'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No audio file provided' });
        return;
      }

      const transcript = await transcribeAudio(req.file.buffer, req.file.mimetype);

      res.json({
        transcript,
        durationSeconds: 0, // TODO: calculate from audio metadata
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
