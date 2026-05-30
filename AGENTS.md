# AGENTS.md — VoiceUI

> Standard agent instructions for OpenAI Codex and compatible agents.

---

## Setup

```bash
# Install dependencies (requires Node.js 20+, pnpm 9+)
pnpm install

# Set required environment variables
cp .env.example .env
# Edit .env — set OPENAI_API_KEY, PORT=3001, CLIENT_URL=http://localhost:5173

# Verify setup
pnpm test         # should pass
pnpm typecheck    # should pass with 0 errors
pnpm lint         # should pass with 0 errors
```

---

## Running the Project

```bash
pnpm dev           # start both client and server
pnpm dev:client    # Vite dev server on :5173
pnpm dev:server    # Express server on :3001 with ts-node-dev hot reload
pnpm build         # production build
```

---

## Testing

```bash
pnpm test              # run all tests
pnpm test:client       # Vitest only (React components + hooks)
pnpm test:server       # Jest only (Express routes + services)
pnpm test:watch        # watch mode
pnpm test:coverage     # coverage report (target ≥ 80% on services/ and hooks/)
```

**ALWAYS write failing tests BEFORE implementing any feature.**  
**NEVER skip or comment out a failing test — fix the implementation instead.**  
**If a test is wrong, fix the test with a comment explaining why, then fix the code.**

---

## Code Style

### TypeScript / General

- TypeScript strict mode — no `any`, no `@ts-ignore` without a comment explaining why
- Use `const` by default; `let` only when reassignment is necessary
- Prefer `type` over `interface` for data shapes; `interface` for React component props
- Import order: external → internal `@/` → relative — enforce via ESLint `import/order` rule
- No default exports except React components — use named exports everywhere else
- Function signatures: always type parameters and return values explicitly in service/utility functions

### React (Client)

- Functional components with typed props: `const Foo: React.FC<FooProps> = ({ ... }) => { ... }`
- Custom hooks must start with `use` and return a plain object (not array) unless it's a pair
- Tailwind classes only — no inline `style={{}}` (except dynamic transforms/animations that Tailwind can't express)
- Error states and loading states must always be handled — no silent failures in UI

### Server (Node / Express)

- All route handlers are async and wrapped with an `asyncHandler` utility that catches and forwards errors
- Input validation with Zod at route entry — never trust `req.body` shapes
- Services are pure functions (no side effects beyond the OpenAI API call) and independently testable
- Log with structured JSON (not `console.log`) using a logger utility

---

## PR Instructions

Every pull request must include:

1. **What changed**: one-paragraph description of the feature or fix
2. **Why**: link to the relevant TODO.md item or issue
3. **Test evidence**: paste the output of `pnpm test` showing all tests passing
4. **Manual test evidence**: screenshot, screen recording, or curl output showing the feature working
5. **AI assistance disclosure**: if AI generated any code, note what was generated and confirm you reviewed the diff line-by-line

**PR size**: Keep PRs to ≤ 400 lines changed. Split large features into multiple PRs by TODO phase.

**Do not merge if**:
- Any test is failing
- `pnpm typecheck` reports errors
- `pnpm lint` reports errors
- The PR has no test evidence

---

## Architecture Boundaries

- **Never** import `openai` directly in route files — all AI calls go through `services/`
- **Never** expose `OPENAI_API_KEY` to the client bundle — all AI calls are server-side
- **Never** use `dangerouslySetInnerHTML` in the main React app — only inside the sandboxed `CodePreview` iframe
- **Never** store audio files on disk — process in memory and discard after transcription
- **Never** remove a test unless the feature it covers is also deleted (and that deletion is intentional)
