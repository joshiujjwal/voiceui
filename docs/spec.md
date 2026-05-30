# VoiceUI — Feature Specification

> **Status:** Draft  
> **Last updated:** 2025-07  
> **Owner:** joshiujjwal

---

## 1. Overview

### Problem Statement

UI prototyping requires either design tools (Figma, Sketch) or writing code by hand. Both have high friction for rapid ideation. Non-engineers can't prototype at all. Even engineers with Copilot still need to type.

VoiceUI removes the keyboard from the prototyping loop: you describe what you want in plain English, and see it rendered live.

### Core Value Proposition

| User type | Pain point solved |
|---|---|
| Frontend engineer | Skip boilerplate; speak → get working component code |
| Designer | No-code UI prototyping via voice |
| PM / non-engineer | Sketch UI ideas without Figma or dev dependency |

---

## 2. Functional Requirements

### 2.1 Voice Capture

- [ ] App captures audio from the user's microphone via browser `MediaRecorder` API
- [ ] User controls recording with a single press-and-hold or toggle button
- [ ] Audio is captured as WebM/Opus or WAV (browser-native format)
- [ ] Recording state is visually indicated (idle / recording / processing)
- [ ] App handles microphone permission denied gracefully with a clear error message
- [ ] Maximum recording duration: 60 seconds (configurable server-side)

### 2.2 Transcription (Whisper)

- [ ] Audio blob is sent to server as `multipart/form-data`
- [ ] Server forwards to OpenAI `whisper-1` model via `audio.transcriptions.create`
- [ ] Transcript returned to client within 5 seconds for ≤ 30s audio
- [ ] Language: English only (v0.1); multilingual in backlog
- [ ] Transcript displayed to user before generation begins (confirmation step optional)

### 2.3 UI Code Generation (GPT-4o)

- [ ] Transcript sent to server POST `/api/generate`
- [ ] Server builds a structured system prompt (see §5) and calls GPT-4o
- [ ] Response conforms to JSON schema: `{ code: string, componentName: string, description: string }`
- [ ] `code` is a self-contained React functional component with Tailwind CSS classes
- [ ] No external imports other than React (components must be preview-renderable standalone)
- [ ] Generation completes or streams partial results within 10 seconds
- [ ] Streaming tokens forwarded to client via WebSocket for real-time code appearance

### 2.4 Live Preview

- [ ] Generated code rendered in a sandboxed `<iframe>` using Babel standalone + Tailwind CDN
- [ ] Preview updates in real-time as streaming tokens arrive
- [ ] Code editor pane (CodeMirror/Monaco) displays editable final code with JSX syntax highlighting
- [ ] User can manually edit code; preview re-renders on change (debounced 300ms)
- [ ] Copy-to-clipboard button copies the code string

### 2.5 Session History

- [ ] Each generation in a session is saved in client-side state (not persisted to DB in v0.1)
- [ ] History panel lists previous generations with component name + timestamp
- [ ] Clicking a history item restores that generation to the editor + preview
- [ ] Maximum 20 history items per session (LRU eviction)

### 2.6 Error Handling

- [ ] Microphone permission denied → in-app error with browser settings link
- [ ] Network timeout → user-visible retry prompt
- [ ] OpenAI quota exceeded → "Service temporarily unavailable" with HTTP 503
- [ ] GPT-4o returns malformed JSON → server retries once, then returns 500 with message
- [ ] Empty transcript (silence/noise) → prompt user to try again

---

## 3. Non-Functional Requirements

- [ ] **Latency**: Total voice → preview time ≤ 15 seconds on median broadband (50 Mbps)
- [ ] **Availability**: Server health endpoint responds in < 200ms
- [ ] **Security**: API key never exposed to client; all OpenAI calls are server-side
- [ ] **Rate limiting**: 10 requests/minute per IP for transcribe and generate endpoints
- [ ] **Browser support**: Chrome 100+, Edge 100+, Firefox 110+, Safari 16+ (MediaRecorder support)
- [ ] **Accessibility**: WCAG 2.1 AA — keyboard accessible, screen-reader labels on all interactive elements
- [ ] **Bundle size**: Client bundle < 500KB gzipped (excluding CodeMirror/Monaco)

---

## 4. Data Model

### 4.1 Request / Response Types (TypeScript)

```ts
// POST /api/transcribe
// multipart/form-data: { audio: File }
interface TranscribeResponse {
  transcript: string;
  durationSeconds: number;
}

// POST /api/generate
interface GenerateRequest {
  transcript: string;
}

interface GenerateResponse {
  code: string;            // React JSX string
  componentName: string;   // PascalCase name inferred from transcript
  description: string;     // One-sentence summary of the component
}

// WebSocket message (server → client, streaming)
interface StreamChunk {
  type: "chunk" | "done" | "error";
  content?: string;   // partial code token
  error?: string;
}

// Client-side session history item
interface HistoryItem {
  id: string;                 // uuid
  timestamp: number;          // Unix ms
  transcript: string;
  componentName: string;
  code: string;
  description: string;
}
```

---

## 5. Prompt Design

### System Prompt (GPT-4o)

```
You are a UI code generator. The user will describe a UI component or layout in natural language.
Your job is to generate a single self-contained React functional component using Tailwind CSS classes.

Rules:
- Output ONLY a JSON object matching this schema:
  { "code": "<jsx string>", "componentName": "<PascalCase>", "description": "<one sentence>" }
- The `code` field must be a complete React functional component (function declaration + export default)
- Use only Tailwind CSS for styling — no inline styles, no CSS imports
- No external imports except `import React from 'react'`
- Component must be renderable standalone in a sandboxed iframe
- If the description is ambiguous, pick the most common/sensible interpretation
- Never include markdown, explanations, or anything outside the JSON object
```

### User Message

```
Generate a UI component for: "<transcript>"
```

---

## 6. API Design

### REST Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Server health check |
| POST | `/api/transcribe` | Upload audio → returns transcript |
| POST | `/api/generate` | Transcript → returns component code |

### WebSocket

| Path | Direction | Description |
|---|---|---|
| `ws://host/ws/generate` | Server → Client | Streams GPT-4o tokens during generation |

---

## 7. Test Plan

### Unit Tests

| Area | Test cases |
|---|---|
| `useVoiceCapture` | start/stop transitions, error on permission denied, audio chunk accumulation |
| `audio.ts` | valid Blob → File conversion, correct MIME type |
| `prompt.ts` | transcript → structured messages, system prompt content |
| `whisper.ts` service | mock client called with correct params, returns transcript string |
| `gpt.ts` service | mock client returns structured JSON, schema enforced |
| `CodePreview` | renders iframe, injects Tailwind CDN, sandbox attribute set |
| `VoiceButton` | idle/recording/processing states, ARIA labels |
| History store | add item, LRU eviction at 20, restore item |

### Integration Tests

| Area | Test cases |
|---|---|
| `POST /api/health` | 200 `{ status: "ok" }` |
| `POST /api/transcribe` | mock file → 200 transcript; missing file → 400; large file → 413 |
| `POST /api/generate` | valid transcript → 200 JSON; empty transcript → 400; OpenAI error → 500 |
| Rate limiter | 11th request within 1 min → 429 |

### E2E Tests (Playwright)

| Flow | Test |
|---|---|
| Full happy path | Mock Whisper + GPT-4o responses → voice button → preview renders correct component |
| Error path | Mock Whisper error → error state shown in UI |

---

## 8. Open Questions

- [ ] Should the client send raw audio or pre-process it (resample to 16kHz mono) to reduce Whisper latency?
- [ ] WebSocket or Server-Sent Events (SSE) for streaming? SSE is simpler but WebSocket is bidirectional — needed?
- [ ] Should generated components use shadcn/ui primitives as base? Would require bundling shadcn in the iframe sandbox.
- [ ] Per-user API key support vs single server key? (User-supplied keys would remove rate limit risk)
- [ ] Should code edits be reflected back into the voice context for iterative refinement in v0.1?
