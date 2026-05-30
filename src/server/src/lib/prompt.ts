import type { ChatCompletionMessageParam } from 'openai/resources/chat/completions';

const SYSTEM_PROMPT = `You are a UI code generator. The user will describe a UI component or layout in natural language.
Your job is to generate a single self-contained React functional component using Tailwind CSS classes.

Rules:
- Output ONLY a JSON object matching the provided schema: { code, componentName, description }
- The "code" field must be a complete React functional component (function declaration + export default)
- Use ONLY Tailwind CSS for styling — no inline styles, no CSS module imports
- The only allowed import is: import React from 'react'
- The component must be renderable standalone in a sandboxed iframe (no external data fetching)
- componentName must be PascalCase, derived from the user's description
- description must be one sentence explaining what the component does
- If the description is ambiguous, choose the most common/sensible UI interpretation
- Never include markdown fences, explanations, or anything outside the JSON object`;

/**
 * Builds the GPT-4o messages array for UI code generation.
 */
export function buildGenerationMessages(transcript: string): ChatCompletionMessageParam[] {
  return [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: `Generate a UI component for: "${transcript}"` },
  ];
}
