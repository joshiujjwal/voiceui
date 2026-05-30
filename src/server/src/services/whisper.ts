import OpenAI from 'openai';
import { toFile } from 'openai';

import { env } from '../lib/env';

const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });

/**
 * Transcribes audio using OpenAI Whisper.
 * @param audioBuffer - Raw audio buffer from the uploaded file
 * @param mimeType - MIME type of the audio (e.g., 'audio/webm')
 * @returns The transcribed text
 */
export async function transcribeAudio(audioBuffer: Buffer, mimeType: string): Promise<string> {
  const file = await toFile(audioBuffer, 'recording.webm', { type: mimeType });

  const response = await client.audio.transcriptions.create({
    model: 'whisper-1',
    file,
    language: 'en',
  });

  return response.text;
}

// Export the client for testing (allows jest.mock to replace it)
export { client as openaiClient };
