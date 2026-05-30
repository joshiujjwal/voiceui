# VoiceUI

> 🎙️ Speak your UI — describe interface components or layouts in natural language and AI generates live UI code/previews in real-time.

![Status](https://img.shields.io/badge/status-🚧%20Early%20Development-orange)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![React](https://img.shields.io/badge/React-18.x-61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-20.x-green)

---

## What It Does

VoiceUI turns spoken language into live UI components. You describe a button, a form, a dashboard layout — in natural speech — and the app:

1. **Transcribes** your voice via OpenAI Whisper
2. **Interprets** the UI intent via GPT-4o with a structured prompt schema
3. **Generates** React/Tailwind component code in real-time
4. **Renders** a live preview alongside the code

No keyboard required. No Figma. Just talk.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Tailwind CSS, Vite |
| Backend | Node.js 20, Express, TypeScript |
| AI — Speech | OpenAI Whisper API |
| AI — Code Gen | OpenAI GPT-4o (structured outputs) |
| Real-time | WebSocket (ws) |
| Testing | Vitest (client), Jest (server) |
| Linting | ESLint + Prettier |
| CI | GitHub Actions |

---

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- OpenAI API key

### Setup

```bash
git clone https://github.com/joshiujjwal/voiceui.git
cd voiceui

# Install all dependencies
pnpm install

# Copy env template and fill in your OpenAI API key
cp .env.example .env
```

### Development

```bash
# Start both client and server with hot reload
pnpm dev

# Client only (Vite, http://localhost:5173)
pnpm dev:client

# Server only (Express, http://localhost:3001)
pnpm dev:server
```

### Testing

```bash
# Run all tests (client + server)
pnpm test

# Watch mode
pnpm test:watch

# Coverage report
pnpm test:coverage
```

### Build

```bash
pnpm build
```

---

## Project Structure

```
voiceui/
├── src/
│   ├── client/
│   │   ├── components/    # React UI components
│   │   ├── hooks/         # Custom hooks (useVoiceCapture, useUIGeneration)
│   │   └── lib/           # Client utilities, WebSocket client
│   └── server/
│       ├── routes/        # Express route handlers
│       ├── services/      # Whisper + GPT-4o service wrappers
│       └── lib/           # Server utilities, prompt templates
├── tests/
│   ├── client/            # Vitest tests for React components/hooks
│   └── server/            # Jest tests for API + services
├── docs/
│   ├── spec.md            # Feature specification
│   └── adr/               # Architecture Decision Records
├── .github/
│   ├── copilot-instructions.md
│   ├── instructions/
│   └── skills/
├── README.md
├── TODO.md
├── CLAUDE.md
└── AGENTS.md
```

---

## Contributing

- **Write tests first.** Every PR must include passing tests before implementation.
- **Small, focused PRs.** One feature or fix per PR.
- **Evidence required.** PR descriptions must include: what changed, test output, and a manual test screenshot/recording where applicable.
- **No unreviewed AI-generated code.** If you used AI assistance, say so and confirm you reviewed the diff.
- **Never remove a test** unless the feature it covers is deleted.

## 🚀 Improvement Proposals

### First-Principles Analysis
- **Natural language → UI code is a two-step problem that must be kept separate**: Speech-to-text accuracy and UI intent interpretation accuracy are independent failure modes — conflating them in a single pipeline makes it impossible to diagnose whether a bad output is a transcription error or an interpretation error; the architecture should preserve the intermediate transcript for debugging.
- **GPT-4o structured outputs are the right technical choice**, but UI component generation requires a component schema that maps to a constrained output space — unconstrained generation produces valid React code that is syntactically correct but structurally inconsistent; a component grammar/schema must define what the model is allowed to output.
- **WebSocket for real-time streaming is appropriate**, but the round-trip latency (Whisper transcription → GPT-4o generation → render) is likely 2–5 seconds for a moderately complex component; progressive streaming of the generated code (token by token) must be implemented, not just the final output.
- **Live preview creates a security attack surface**: Executing generated React/Tailwind code in a browser preview requires sandboxing (iframe sandbox, CSP, no access to parent window); failing to sandbox the preview allows XSS in generated code to escape to the host page.

### Key Risks & Assumptions
- **Assumes spoken UI descriptions are precise enough to generate correct components**: Real users say "make a button" not "create a primary action button with Tailwind classes bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"; the system needs intelligent defaults and a clarification loop for underspecified descriptions.
- **Generated Tailwind classes may conflict with host application styles**: Code generated in isolation, without knowing the consuming app's Tailwind config and existing component library, may produce visually inconsistent output; without a design system context, the tool generates components that need restyling before use.
- **OpenAI API dependency creates cost scaling risk**: Whisper + GPT-4o per utterance with real-time generation is expensive; a power user session could generate $5–10 in API costs per hour, requiring a subscription model or per-generation pricing from day one.
- **Browser microphone access in enterprise environments is frequently blocked**: The core input mechanism is gated by permission dialogs that enterprise IT policies often deny; this limits addressable market to developers with personal machines or permissive environments.

### Concrete Improvement Ideas
- **Define a typed component generation schema** — create a JSON schema defining valid component types, prop options, and Tailwind variant mappings; constrain GPT-4o output to this schema via structured outputs; this produces consistent, predictable components instead of free-form code (highest impact).
- **Sandbox the live preview in a strict iframe** — implement the component preview in an `<iframe sandbox="allow-scripts">` with a Content Security Policy that blocks external network access; this makes the feature safe to ship without a security review of every generated output.
- **Stream generated code token-by-token to the editor** — use SSE or WebSocket streaming from the GPT-4o response; users see code appearing in real time, reducing perceived latency from "wait for completion" to "watch it build"; this is the single biggest UX improvement.
- **Add a component edit and refinement cycle** — after initial generation, allow voice or text follow-up commands ("make it bigger", "change the color to red", "add a loading state"); the system appends context and regenerates; this conversational refinement loop is more valuable than one-shot generation.
- **Build a component library export feature** — let users collect generated components into a named library and export as a zip with proper file structure, TypeScript types, and Storybook stories; transforms the tool from a toy into a development accelerator.
- **Implement usage-based cost tracking and budget controls** — display per-session API cost, set monthly budget caps, and alert users when approaching limits; without cost transparency, API bills will surprise users and drive churn.
