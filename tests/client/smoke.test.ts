import { describe, it, expect } from 'vitest';

// Smoke test — confirms the Vitest runner is working correctly.
// This test has no production value beyond verifying the test infrastructure.
describe('client smoke test', () => {
  it('passes', () => {
    expect(true).toBe(true);
  });

  it('can do arithmetic', () => {
    expect(1 + 1).toBe(2);
  });
});
