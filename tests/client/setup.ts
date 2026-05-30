import '@testing-library/jest-dom';

// Mock MediaRecorder globally (not available in jsdom)
class MockMediaRecorder {
  state: string = 'inactive';
  mimeType: string = 'audio/webm';
  stream: MediaStream;
  ondataavailable: ((e: { data: Blob }) => void) | null = null;
  onstop: (() => void) | null = null;

  constructor(stream: MediaStream) {
    this.stream = stream;
  }

  start(_timeslice?: number) {
    this.state = 'recording';
  }

  stop() {
    this.state = 'inactive';
    if (this.onstop) this.onstop();
  }

  static isTypeSupported(_type: string): boolean {
    return true;
  }
}

Object.defineProperty(global, 'MediaRecorder', {
  writable: true,
  value: MockMediaRecorder,
});

// Mock navigator.mediaDevices
Object.defineProperty(global.navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: vi.fn().mockResolvedValue({
      getTracks: () => [{ stop: vi.fn() }],
    }),
  },
});

// Mock crypto.randomUUID
Object.defineProperty(global.crypto, 'randomUUID', {
  writable: true,
  value: () => 'test-uuid-1234',
});
