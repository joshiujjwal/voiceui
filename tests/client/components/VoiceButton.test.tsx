import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { VoiceButton } from '../../../src/client/src/components/VoiceButton';

describe('VoiceButton', () => {
  it('renders with idle state', () => {
    render(
      <VoiceButton state="idle" onStartRecording={() => {}} onStopRecording={() => {}} />
    );
    expect(screen.getByRole('button', { name: 'Start recording' })).toBeInTheDocument();
  });

  it('shows "Stop recording" label when recording', () => {
    render(
      <VoiceButton state="recording" onStartRecording={() => {}} onStopRecording={() => {}} />
    );
    const btn = screen.getByRole('button', { name: 'Stop recording' });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('aria-pressed', 'true');
  });

  it('is disabled in processing state', () => {
    render(
      <VoiceButton state="processing" onStartRecording={() => {}} onStopRecording={() => {}} />
    );
    expect(screen.getByRole('button', { name: 'Processing…' })).toBeDisabled();
  });

  it('calls onStartRecording when clicked in idle state', async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    render(
      <VoiceButton state="idle" onStartRecording={onStart} onStopRecording={() => {}} />
    );
    await user.click(screen.getByRole('button'));
    expect(onStart).toHaveBeenCalledOnce();
  });

  it('calls onStopRecording when clicked in recording state', async () => {
    const user = userEvent.setup();
    const onStop = vi.fn();
    render(
      <VoiceButton state="recording" onStartRecording={() => {}} onStopRecording={onStop} />
    );
    await user.click(screen.getByRole('button'));
    expect(onStop).toHaveBeenCalledOnce();
  });
});
