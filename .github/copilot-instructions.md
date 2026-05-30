# GitHub Copilot Instructions — VoiceUI

## Project Summary

VoiceUI converts spoken natural-language UI descriptions into live React + Tailwind CSS component previews. The pipeline is: browser `MediaRecorder` → OpenAI Whisper (transcription) → GPT-4o structured output (code gen) → sandboxed iframe preview.

**Stack**: TypeScript 5, React 18, Tailwind CSS, Vite (client) | Node.js 20, Express, ts-node-dev (server) | OpenAI SDK (Whisper + GPT-4o) | Vitest (client tests) | Jest + Supertest (server tests) | pnpm workspaces

---

## Coding Conventions

### TypeScript

- Strict mode always — `"strict": true` in all tsconfigs
- Use `unknown` + type guards instead of `any`
- Prefer `type` aliases for data shapes; `interface` for React prop types
- Explicit return types on all service and utility functions
- No `!` non-null assertion without a guard comment

### React

- Functional components only, typed as `const Foo: React.FC<FooProps>`
- All stateful logic in custom hooks in `src/client/hooks/`
- Tailwind CSS only — no inline styles, no CSS modules
- Every component that has async behavior must handle loading, error, and success states explicitly
- ARIA labels required on all interactive elements (voice button, copy button, etc.)

### Server

- Route handlers: always `async`, always wrapped in `asyncHandler`
- Validate all inputs with Zod before using them
- OpenAI API calls only in `src/server/services/` — not in routes
- Structured JSON logging — never raw `console.log` in production code paths

### File Naming

- React components: `PascalCase.tsx`
- Hooks: `useCamelCase.ts`
- Server modules: `camelCase.ts`
- Test files: `<source-filename>.test.ts[x]` in `tests/` directory

---

## Testing Conventions

- **Write the test first.** Implementation follows failing tests.
- Client tests use Vitest + React Testing Library
  - Mock `MediaRecorder` and `fetch` — never depend on real browser APIs in tests
  - Render components with `render()` from `@testing-library/react`
- Server tests use Jest + Supertest
  - Mock the entire `openai` module: `jest.mock('openai')`
  - Test each route independently; never hit real OpenAI in tests
- Test file locations: `tests/client/` mirrors `src/client/`; `tests/server/` mirrors `src/server/`
- Coverage target: ≥ 80% on `services/` and `hooks/`

---

## What Copilot Should NOT Do

- **Do not** refactor existing working code unless explicitly asked
- **Do not** add new dependencies without a comment explaining why the existing stack can't handle it
- **Do not** remove or skip any existing test — fix the implementation if a test fails
- **Do not** add `console.log` debug statements to committed code
- **Do not** use `any` type or `@ts-ignore` without a detailed comment
- **Do not** expose secrets or environment variables in client-side code
- **Do not** use `dangerouslySetInnerHTML` in the main React app (only allowed inside the sandboxed CodePreview iframe component)
- **Do not** inline OpenAI API calls in route handlers — they belong in `services/`

---

## Key Files to Know

| File | Purpose |
|---|---|
| `src/server/lib/prompt.ts` | Builds the GPT-4o system + user messages — the core of code gen quality |
| `src/server/services/gpt.ts` | GPT-4o structured output call — schema enforcement happens here |
| `src/server/services/whisper.ts` | Whisper API call — receives multipart audio, returns transcript |
| `src/client/hooks/useVoiceCapture.ts` | MediaRecorder lifecycle — start/stop/error/chunks |
| `src/client/hooks/useUIGeneration.ts` | Orchestrates transcribe → generate → stream → state update |
| `src/client/components/CodePreview.tsx` | Sandboxed iframe renderer with Babel + Tailwind CDN |
| `docs/spec.md` | Full feature specification — check here before implementing anything new |
| `TODO.md` | Phased task list — tells you what to build next |
