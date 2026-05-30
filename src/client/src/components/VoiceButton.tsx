import React from 'react';

import type { VoiceCaptureState } from '../lib/types';

interface VoiceButtonProps {
  state: VoiceCaptureState;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

const stateConfig: Record<VoiceCaptureState, { label: string; className: string }> = {
  idle: {
    label: 'Start recording',
    className: 'bg-blue-600 hover:bg-blue-700 text-white',
  },
  recording: {
    label: 'Stop recording',
    className: 'bg-red-600 hover:bg-red-700 text-white animate-pulse',
  },
  processing: {
    label: 'Processing…',
    className: 'bg-yellow-500 text-white cursor-not-allowed',
  },
  error: {
    label: 'Try again',
    className: 'bg-gray-600 hover:bg-gray-700 text-white',
  },
};

export const VoiceButton: React.FC<VoiceButtonProps> = ({
  state,
  onStartRecording,
  onStopRecording,
}) => {
  const { label, className } = stateConfig[state];
  const isDisabled = state === 'processing';

  const handleClick = () => {
    if (state === 'recording') {
      onStopRecording();
    } else if (!isDisabled) {
      onStartRecording();
    }
  };

  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={state === 'recording'}
      disabled={isDisabled}
      onClick={handleClick}
      className={`flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold shadow-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${className}`}
    >
      {/* Mic icon */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path d="M12 1a4 4 0 0 1 4 4v7a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4z" />
        <path d="M19 10a1 1 0 0 0-2 0 5 5 0 0 1-10 0 1 1 0 0 0-2 0 7 7 0 0 0 6 6.92V19H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-2.08A7 7 0 0 0 19 10z" />
      </svg>
      {label}
    </button>
  );
};
