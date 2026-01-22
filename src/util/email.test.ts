import { truncateOriginalMessage } from './email'

describe('truncateOriginalMessage', () => {
  it('should return text without original message marker as is', () => {
    const input = 'Hello, this is a simple message.'
    const result = truncateOriginalMessage(input)
    expect(result).toBe('Hello, this is a simple message.')
  })

  it('should truncate text after "--- Original message ---" marker', () => {
    const input = `Main content here.

--- Original message ---
This is the quoted original message.
It should be removed.`
    const result = truncateOriginalMessage(input)
    expect(result).toBe('Main content here.')
  })

  it('should handle different dash lengths in original message marker', () => {
    const input = `Content before.

---------- Original message ----------
Quoted text here.`
    const result = truncateOriginalMessage(input)
    expect(result).toBe('Content before.')
  })

  it('should truncate Gmail-style quoted messages', () => {
    const input = `Reply text here.

2024年1月15日 10:30 Someone <someone@example.com>:
  > Original quoted message
  > More quoted text`
    const result = truncateOriginalMessage(input)
    expect(result).toBe('Reply text here.')
  })

  it('should handle English date format in quoted messages', () => {
    const input = `My reply.

2024/01/15 14:00 John Doe <john@example.com>:
  > Previous message`
    const result = truncateOriginalMessage(input)
    expect(result).toBe('My reply.')
  })

  it('should handle empty string', () => {
    const result = truncateOriginalMessage('')
    expect(result).toBe('')
  })

  it('should preserve multiline content before markers', () => {
    const input = `First paragraph.

Second paragraph.

Third paragraph.

--- Original message ---
Quoted content.`
    const result = truncateOriginalMessage(input)
    expect(result).toBe(`First paragraph.

Second paragraph.

Third paragraph.`)
  })
})
