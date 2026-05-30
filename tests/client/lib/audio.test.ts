import { describe, it, expect } from 'vitest';

import { blobToAudioFile, isMediaRecorderSupported } from '../../../src/client/src/lib/audio';

describe('blobToAudioFile', () => {
  it('converts a Blob to a File with the given filename', () => {
    const blob = new Blob(['audio-data'], { type: 'audio/webm' });
    const file = blobToAudioFile(blob, 'test.webm');
    expect(file).toBeInstanceOf(File);
    expect(file.name).toBe('test.webm');
    expect(file.type).toBe('audio/webm');
  });

  it('normalizes Chrome video/webm MIME type to audio/webm', () => {
    const blob = new Blob(['audio-data'], { type: 'video/webm;codecs=opus' });
    const file = blobToAudioFile(blob);
    expect(file.type).toBe('audio/webm');
  });

  it('preserves non-webm MIME types', () => {
    const blob = new Blob(['audio-data'], { type: 'audio/wav' });
    const file = blobToAudioFile(blob);
    expect(file.type).toBe('audio/wav');
  });

  it('uses default filename if none provided', () => {
    const blob = new Blob(['audio-data'], { type: 'audio/webm' });
    const file = blobToAudioFile(blob);
    expect(file.name).toBe('recording.webm');
  });
});

describe('isMediaRecorderSupported', () => {
  it('returns true when MediaRecorder is available', () => {
    // MockMediaRecorder is set up in tests/client/setup.ts
    expect(isMediaRecorderSupported()).toBe(true);
  });
});
