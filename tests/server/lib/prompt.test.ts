import { buildGenerationMessages } from '../../../src/server/src/lib/prompt';

describe('buildGenerationMessages', () => {
  it('returns an array of two messages', () => {
    const messages = buildGenerationMessages('a blue submit button');
    expect(messages).toHaveLength(2);
  });

  it('first message is a system message', () => {
    const messages = buildGenerationMessages('a blue submit button');
    expect(messages[0].role).toBe('system');
  });

  it('second message is a user message', () => {
    const messages = buildGenerationMessages('a blue submit button');
    expect(messages[1].role).toBe('user');
  });

  it('user message contains the transcript', () => {
    const transcript = 'a blue submit button with rounded corners';
    const messages = buildGenerationMessages(transcript);
    const userMessage = messages[1];
    expect(typeof userMessage.content).toBe('string');
    expect(userMessage.content as string).toContain(transcript);
  });

  it('system message instructs output format', () => {
    const messages = buildGenerationMessages('anything');
    const systemContent = messages[0].content as string;
    expect(systemContent).toContain('JSON');
    expect(systemContent).toContain('Tailwind');
    expect(systemContent).toContain('componentName');
  });

  it('handles an empty transcript without throwing', () => {
    expect(() => buildGenerationMessages('')).not.toThrow();
  });
});
