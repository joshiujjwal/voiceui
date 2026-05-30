import { useState, useCallback } from 'react';

import type { GenerateResponse, HistoryItem, UIGenerationState } from '../lib/types';

interface UseUIGenerationReturn {
  state: UIGenerationState;
  result: GenerateResponse | null;
  history: HistoryItem[];
  error: string | null;
  generate: (audioBlob: Blob) => Promise<void>;
  restoreHistoryItem: (id: string) => void;
}

/**
 * useUIGeneration — orchestrates the full pipeline:
 *   audio blob → transcribe (Whisper) → generate (GPT-4o) → result
 */
export function useUIGeneration(): UseUIGenerationReturn {
  const [state, setState] = useState<UIGenerationState>('idle');
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(async (audioBlob: Blob) => {
    setError(null);
    setState('transcribing');

    try {
      // Step 1: Transcribe audio
      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const transcribeRes = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!transcribeRes.ok) {
        throw new Error(`Transcription failed: ${transcribeRes.statusText}`);
      }

      const { transcript } = (await transcribeRes.json()) as { transcript: string };

      setState('generating');

      // Step 2: Generate UI code
      const generateRes = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });

      if (!generateRes.ok) {
        throw new Error(`Code generation failed: ${generateRes.statusText}`);
      }

      const generated = (await generateRes.json()) as GenerateResponse;
      setResult(generated);
      setState('done');

      // Add to history (cap at 20, LRU)
      const historyItem: HistoryItem = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        transcript,
        componentName: generated.componentName,
        code: generated.code,
        description: generated.description,
      };

      setHistory((prev) => [historyItem, ...prev].slice(0, 20));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(message);
      setState('error');
    }
  }, []);

  const restoreHistoryItem = useCallback(
    (id: string) => {
      const item = history.find((h) => h.id === id);
      if (!item) return;
      setResult({
        code: item.code,
        componentName: item.componentName,
        description: item.description,
      });
      setState('done');
    },
    [history]
  );

  return { state, result, history, error, generate, restoreHistoryItem };
}
