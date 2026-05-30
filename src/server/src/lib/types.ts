import { z } from 'zod';

// ---- API Request / Response Schemas ----

export const TranscribeResponseSchema = z.object({
  transcript: z.string(),
  durationSeconds: z.number(),
});

export const GenerateRequestSchema = z.object({
  transcript: z.string().min(1, 'Transcript cannot be empty').max(2000),
});

export const GenerateResponseSchema = z.object({
  code: z.string().min(1),
  componentName: z.string().min(1),
  description: z.string().min(1),
});

export const StreamChunkSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('chunk'), content: z.string() }),
  z.object({ type: z.literal('done') }),
  z.object({ type: z.literal('error'), error: z.string() }),
]);

// ---- TypeScript types inferred from schemas ----

export type TranscribeResponse = z.infer<typeof TranscribeResponseSchema>;
export type GenerateRequest = z.infer<typeof GenerateRequestSchema>;
export type GenerateResponse = z.infer<typeof GenerateResponseSchema>;
export type StreamChunk = z.infer<typeof StreamChunkSchema>;

// ---- GPT-4o structured output JSON schema ----

export const GPT_OUTPUT_SCHEMA = {
  name: 'ui_component',
  strict: true,
  schema: {
    type: 'object',
    properties: {
      code: {
        type: 'string',
        description: 'A complete React functional component with Tailwind CSS, exported as default',
      },
      componentName: {
        type: 'string',
        description: 'PascalCase component name inferred from the user description',
      },
      description: {
        type: 'string',
        description: 'One-sentence summary of what the component does',
      },
    },
    required: ['code', 'componentName', 'description'],
    additionalProperties: false,
  },
} as const;
