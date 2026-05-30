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
