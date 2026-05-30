import { useState, useRef, useCallback } from 'react';

import type { VoiceCaptureState } from '../lib/types';

interface UseVoiceCaptureReturn {
  state: VoiceCaptureState;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<Blob | null>;
  error: string | null;
}

/**
 * useVoiceCapture — manages MediaRecorder lifecycle for voice input.
 *
 * Usage:
 *   const { state, startRecording, stopRecording, error } = useVoiceCapture();
 */
export function useVoiceCapture(): UseVoiceCaptureReturn {
  const [state, setState] = useState<VoiceCaptureState>('idle');
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobEvent['data'][]>([]);

  const startRecording = useCallback(async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.start(100); // collect chunks every 100ms
      setState('recording');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Microphone access denied';
      setError(message);
      setState('error');
    }
  }, []);

  const stopRecording = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      const recorder = mediaRecorderRef.current;
      if (!recorder || recorder.state === 'inactive') {
        resolve(null);
        return;
      }

      setState('processing');

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType });
        // Stop all tracks to release the microphone
        recorder.stream.getTracks().forEach((track) => track.stop());
        mediaRecorderRef.current = null;
        resolve(blob);
      };

      recorder.stop();
    });
  }, []);

  return { state, startRecording, stopRecording, error };
}
