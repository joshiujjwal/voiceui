// Server smoke test — confirms Jest + ts-jest is configured correctly.
// No production logic; just verifies the test runner can compile and run TypeScript.
describe('server smoke test', () => {
  it('passes', () => {
    expect(true).toBe(true);
  });

  it('can do arithmetic', () => {
    expect(2 + 2).toBe(4);
  });
});
