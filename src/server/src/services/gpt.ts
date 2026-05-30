import OpenAI from 'openai';

import { buildGenerationMessages } from '../lib/prompt';
import { GPT_OUTPUT_SCHEMA, GenerateResponseSchema } from '../lib/types';
import type { GenerateResponse } from '../lib/types';
import { env } from '../lib/env';

const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });

/**
 * Generates a React component from a transcript using GPT-4o structured outputs.
 * @param transcript - The transcribed voice input describing the desired UI
 * @returns Structured component data: code, componentName, description
 */
export async function generateUIComponent(transcript: string): Promise<GenerateResponse> {
  const messages = buildGenerationMessages(transcript);

  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages,
    response_format: {
      type: 'json_schema',
      json_schema: GPT_OUTPUT_SCHEMA,
    },
    temperature: 0.3, // Lower temperature for more deterministic code output
    max_tokens: 2048,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error('GPT-4o returned an empty response');
  }

  const parsed = JSON.parse(content) as unknown;
  const validated = GenerateResponseSchema.parse(parsed);
  return validated;
}

// Export client for testing
export { client as openaiClient };
