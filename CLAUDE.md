# CLAUDE.md — VoiceUI

> Context for AI coding agents. Keep this file under 200 lines.  
> Update this file whenever you discover something non-obvious about the project.

---

## Quick Reference

| Command | What it does |
|---|---|
| `pnpm install` | Install all workspace dependencies |
| `pnpm dev` | Start client (Vite :5173) + server (Express :3001) concurrently |
| `pnpm dev:client` | Vite dev server only |
| `pnpm dev:server` | ts-node-dev server with hot reload |
| `pnpm test` | Run all tests (Vitest + Jest) |
| `pnpm test:client` | Vitest — `tests/client/` |
| `pnpm test:server` | Jest — `tests/server/` |
| `pnpm test:watch` | Watch mode for all tests |
| `pnpm test:coverage` | Coverage report |
| `pnpm lint` | ESLint across all packages |
| `pnpm format` | Prettier across all packages |
| `pnpm build` | Build client (Vite) + compile server (tsc) |
| `pnpm typecheck` | tsc --noEmit across all packages |

---

## Workflow for Every Task

1. **Read TODO.md** — find the next unchecked item in the current phase
2. **Run `pnpm test`** — confirm baseline (all tests pass before you touch anything)
3. **Write failing tests first** — tests live in `tests/client/` or `tests/server/`
4. **Implement minimum code to pass** — no extra abstraction unless spec requires it
5. **Run `pnpm lint && pnpm typecheck`** — fix everything before committing
6. **Commit** with a message in this format: `feat(scope): what changed` or `test(scope): what added`
7. **Update this file** if you learned something non-obvious
8. **Check off the TODO item** and add evidence to the PR description

---

## Directory Map

```
src/
├── client/
│   ├── components/        # React components (VoiceButton, CodeEditor, CodePreview, PreviewPanel, HistoryPanel)
│   ├── hooks/             # useVoiceCapture.ts, useUIGeneration.ts, useHistory.ts
│   └── lib/               # audio.ts (MediaRecorder → File), wsClient.ts (WebSocket wrapper), types.ts
└── server/
    ├── routes/            # transcribe.ts, generate.ts, health.ts
    ├── services/          # whisper.ts (OpenAI Whisper wrapper), gpt.ts (GPT-4o structured output)
    └── lib/               # prompt.ts (system/user message builder), types.ts, errors.ts

tests/
├── client/                # Mirrors src/client/ — one test file per source file
└── server/                # Mirrors src/server/ — one test file per source file
```

---

## Key Conventions

### TypeScript
- Strict mode enabled (`"strict": true` in tsconfig)
- No `any` — use `unknown` and narrow types explicitly
- All OpenAI response types imported from `openai` SDK, not hand-rolled
- Shared types go in `src/server/lib/types.ts` and imported by client via the API contract (not shared package yet)

### React (Client)
- Functional components only — no class components
- Hooks for all stateful logic — no component-level state beyond primitive UI state
- Tailwind CSS only — no styled-components, no CSS modules, no inline styles
- File naming: `PascalCase.tsx` for components, `camelCase.ts` for hooks and utils

### API (Server)
- All routes validate input with Zod before touching any service
- All OpenAI calls are in `services/` — routes must not import `openai` directly
- Errors from OpenAI propagate as typed errors in `lib/errors.ts`; routes map them to HTTP codes
- Never log `OPENAI_API_KEY` or any audio content

### Testing
- **Client**: Vitest + React Testing Library; mock `MediaRecorder` and `fetch` — do NOT use real browser APIs
- **Server**: Jest + supertest for routes; always mock the `openai` SDK client with `jest.mock('openai')`
- Test files live in `tests/`, not co-located with source
- Aim for 80%+ coverage on `services/` and `hooks/`

### Environment Variables
- All env vars loaded via `dotenv` in `src/server/lib/env.ts` with Zod validation at startup
- Server crashes on missing required vars — no silent fallbacks
- Client env vars must be prefixed `VITE_` and contain no secrets

---

## Non-Obvious Gotchas

- **MediaRecorder MIME type**: Chrome outputs `video/webm;codecs=opus`, not `audio/webm`. Whisper accepts it but the MIME type string must be passed correctly in the `multipart/form-data` upload.
- **Babel standalone in iframe**: The CodePreview iframe uses `@babel/standalone` loaded from CDN. JSX transform requires `data-type="module"` is NOT set on the script tag — use classic script with `React` in global scope.
- **GPT-4o structured outputs**: Use `response_format: { type: "json_schema", json_schema: { ... } }` — NOT `response_format: { type: "json_object" }`. The latter doesn't enforce schema.
- **WebSocket on Vite dev**: Vite's dev server uses its own WebSocket on port 5173. The app's WebSocket must use a separate path (`/ws/generate`) on port 3001 to avoid conflicts.
- **pnpm workspace**: Dependencies shared between client and server (e.g., `zod`) must be in the root `package.json` or explicitly listed in each package — pnpm does not hoist automatically.

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `OPENAI_API_KEY` | ✅ | OpenAI API key — server only |
| `PORT` | ✅ | Express server port (default: 3001) |
| `CLIENT_URL` | ✅ | Client origin for CORS (e.g., `http://localhost:5173`) |
| `RATE_LIMIT_RPM` | ❌ | Requests per minute per IP (default: 10) |
| `MAX_AUDIO_MB` | ❌ | Max audio upload size in MB (default: 25) |
