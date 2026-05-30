# VoiceUI — Task Breakdown

## How to Use This File

Workflow per task:
1. **Write tests FIRST** (red phase) — failing tests define the contract
2. **Implement until tests pass** (green phase) — minimal code to satisfy tests
3. **Review diff manually** — confirm no regressions, no unintended changes
4. **Commit with a descriptive message** — one logical unit per commit
5. **Update CLAUDE.md / AGENTS.md** if you learned something new about the project
6. **Gate the next phase** — only proceed when all current-phase tests pass and a human has reviewed

> Evidence gates are marked 🔒. Do not advance past a gate without passing tests + human sign-off.

---

## Phase 0: Foundation ⬜

- [ ] Init pnpm workspace with `client` and `server` packages
- [ ] Configure TypeScript (`tsconfig.base.json`, per-package extends)
- [ ] Set up ESLint + Prettier with shared config across workspaces
- [ ] Configure Vitest for `client/` and Jest for `server/`
- [ ] Write a smoke test in each package (trivial pass — confirms test runner works)
- [ ] Set up Vite for client with React + Tailwind CSS
- [ ] Create Express skeleton server (health endpoint `/api/health`)
- [ ] Write test for `GET /api/health` → 200 `{ status: "ok" }`
- [ ] Add `.env.example` with `OPENAI_API_KEY`, `PORT`, `CLIENT_URL`
- [ ] Set up GitHub Actions CI: lint → test → build on push/PR
- [ ] Review all AI-generated config files and confirm correctness

🔒 **Gate 0**: All smoke tests green, CI pipeline runs end-to-end.

---

## Phase 1: Voice Capture Pipeline ⬜

- [ ] Write tests for `useVoiceCapture` hook: start/stop recording, state transitions, error on permission denied
- [ ] Implement `useVoiceCapture` hook using `MediaRecorder` API to capture audio chunks
- [ ] Write tests for audio Blob formatting (WAV/WebM, correct MIME type)
- [ ] Implement audio export utility (`src/client/lib/audio.ts`) — converts MediaRecorder output to File
- [ ] Write server test: `POST /api/transcribe` with a mock audio file → returns `{ transcript: string }`
- [ ] Implement Whisper service (`src/server/services/whisper.ts`) — wraps OpenAI `audio.transcriptions.create`
- [ ] Write server test for Whisper service: mock OpenAI client, verify correct params passed
- [ ] Implement `/api/transcribe` route — validates file, calls Whisper service, returns transcript
- [ ] Write client-side test for `useVoiceCapture` → upload flow integration
- [ ] Add error boundary component for microphone permission failures
- [ ] Manual test: record voice, receive transcript — capture screenshot as evidence

🔒 **Gate 1**: Voice → transcript pipeline works end-to-end with evidence screenshot.

---

## Phase 2: UI Code Generation ⬜

- [ ] Define `UIGenerationRequest` and `UIGenerationResponse` TypeScript interfaces in `src/server/lib/types.ts`
- [ ] Write tests for the GPT-4o prompt builder (`src/server/lib/prompt.ts`): given transcript → returns structured prompt with system + user messages
- [ ] Implement prompt builder — system prompt instructs GPT-4o to output valid React + Tailwind JSX as a JSON object `{ code: string, componentName: string, description: string }`
- [ ] Write server test: `POST /api/generate` with mock transcript → returns `{ code, componentName, description }`
- [ ] Implement GPT service (`src/server/services/gpt.ts`) — calls GPT-4o with structured output schema
- [ ] Write test for GPT service: mock OpenAI client, verify schema enforcement (structured outputs)
- [ ] Implement `/api/generate` route — accepts transcript, runs GPT service, returns component data
- [ ] Write client test for `useUIGeneration` hook: given transcript state → calls generate endpoint → returns component code
- [ ] Implement `useUIGeneration` hook
- [ ] Add streaming support: switch `/api/generate` to stream GPT-4o tokens → client receives partial code updates via WebSocket
- [ ] Write WebSocket connection test (mock ws server)
- [ ] Manual test: speak "a blue submit button with rounded corners" → confirm generated JSX and preview

🔒 **Gate 2**: Voice → transcript → GPT code gen → returned JSX. Manual test evidence required.

---

## Phase 3: Live Preview Renderer ⬜

- [ ] Write tests for `CodePreview` component: renders an iframe sandbox, displays code string correctly
- [ ] Implement `CodePreview` component — sandboxed iframe with Tailwind CDN injected, renders raw JSX via Babel standalone
- [ ] Write test for `CodeEditor` component: displays editable code, emits onChange events
- [ ] Implement `CodeEditor` component using CodeMirror (or Monaco) with TypeScript/JSX syntax highlighting
- [ ] Write test for split-pane layout component (`PreviewPanel`)
- [ ] Implement `PreviewPanel` — left pane: `CodeEditor`, right pane: `CodePreview`, resizable
- [ ] Write test for `VoiceButton` component: idle / recording / processing states, correct ARIA labels
- [ ] Implement `VoiceButton` — animated mic icon, accessible, shows recording state
- [ ] Implement main `App` component — wires `VoiceButton` → `useVoiceCapture` → `useUIGeneration` → `PreviewPanel`
- [ ] Add history panel: list of previous generations in session, click to restore
- [ ] Write tests for history state management
- [ ] Manual test: full flow — speak → preview renders — record demo video as evidence

🔒 **Gate 3**: Full end-to-end flow renders in browser. Demo video evidence required.

---

## Phase 4: Polish & Harden ⬜

- [ ] Add rate limiting to `/api/transcribe` and `/api/generate` (express-rate-limit)
- [ ] Write test for rate limit behavior (429 response after threshold)
- [ ] Add request validation with Zod on all API endpoints
- [ ] Write tests for validation error responses (400 with structured errors)
- [ ] Add OpenAI API error handling: timeout, quota exceeded, model errors — with user-facing messages
- [ ] Write tests for each error scenario (mock OpenAI rejections)
- [ ] Add browser compatibility check for `MediaRecorder` (warn if unsupported)
- [ ] Performance: debounce rapid voice submissions; cancel in-flight requests on new submission
- [ ] Accessibility audit: keyboard navigation, screen reader labels, focus management
- [ ] Add copy-to-clipboard button in `CodeEditor` with toast confirmation
- [ ] Lighthouse score ≥ 90 for accessibility and performance
- [ ] Write E2E smoke test with Playwright: full voice-to-preview flow (mock Whisper/GPT)

🔒 **Gate 4**: All hardening tests pass. Lighthouse ≥ 90. E2E test passes in CI.

---

## Phase 5: Ship ⬜

- [ ] Write production Dockerfile (multi-stage: build client, serve via Node)
- [ ] Test Docker build locally
- [ ] Configure environment variable injection for production
- [ ] Add `DEPLOYMENT.md` with hosting options (Railway, Fly.io, Render)
- [ ] Update README with live demo URL (once deployed)
- [ ] Tag v0.1.0 release with changelog

🔒 **Gate 5**: Docker image builds, app runs in container, deployment docs reviewed.

---

## Parking Lot 🅿️

> Ideas to revisit after v0.1.0:

- Multi-component layouts: "a navbar above a hero section above a 3-column grid"
- Export generated components to a local file / GitHub Gist
- Framework toggle: output Tailwind vs CSS Modules vs styled-components
- Voice command for iterative refinement: "make the button red" on existing component
- Figma plugin export
- Local Whisper model (whisper.cpp) for offline mode

---

## Lessons Learned 📝

> Update this section as you go. Each lesson should be a single sentence with context.

- _[Add lessons here as you discover them]_
