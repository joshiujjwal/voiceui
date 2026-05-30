// Shared TypeScript types for VoiceUI API contracts.
// These types are duplicated between client and server until a shared package is warranted.

/** Response from POST /api/transcribe */
export interface TranscribeResponse {
  transcript: string;
  durationSeconds: number;
}

/** Request body for POST /api/generate */
export interface GenerateRequest {
  transcript: string;
}

/** Response from POST /api/generate */
export interface GenerateResponse {
  code: string;           // React JSX string — self-contained functional component
  componentName: string;  // PascalCase inferred from transcript
  description: string;    // One-sentence summary
}

/** WebSocket message streamed from server during generation */
export interface StreamChunk {
  type: 'chunk' | 'done' | 'error';
  content?: string;  // partial code token (only on type === 'chunk')
  error?: string;    // error message (only on type === 'error')
}

/** Client-side session history item */
export interface HistoryItem {
  id: string;
  timestamp: number;  // Unix ms
  transcript: string;
  componentName: string;
  code: string;
  description: string;
}

/** Voice capture state */
export type VoiceCaptureState = 'idle' | 'recording' | 'processing' | 'error';

/** UI generation state */
export type UIGenerationState = 'idle' | 'transcribing' | 'generating' | 'done' | 'error';
