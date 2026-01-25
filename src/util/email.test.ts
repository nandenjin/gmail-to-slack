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

  describe('quoted text detection', () => {
    it('should truncate text when quoted lines (starting with >) are detected', () => {
      const input = `This is my reply.

> This is a quoted line
> This is another quoted line`
      const result = truncateOriginalMessage(input)
      expect(result).toBe('This is my reply.')
    })

    it('should truncate text when quoted lines with leading whitespace are detected', () => {
      const input = `My response here.

  > First quoted line
  > Second quoted line
  > Third quoted line`
      const result = truncateOriginalMessage(input)
      expect(result).toBe('My response here.')
    })

    it('should handle multiple levels of quoting', () => {
      const input = `New message.

>> Nested quote
> Original quote`
      const result = truncateOriginalMessage(input)
      expect(result).toBe('New message.')
    })

    it('should not truncate if > appears in the middle of a line', () => {
      const input = `This is a message with a > character in the middle.

And another line.`
      const result = truncateOriginalMessage(input)
      expect(result).toBe(`This is a message with a > character in the middle.

And another line.`)
    })
  })

  describe('forwarded message handling', () => {
    it('should not truncate forwarded messages with standard header', () => {
      const input = `---------- Forwarded message ---------
From: Someone <someone@example.com>
Date: Mon, Jan 15, 2024 at 10:30 AM
Subject: Important update

This is the forwarded content.
> Some quoted text in the forwarded message
More content here.`
      const result = truncateOriginalMessage(input)
      expect(result).toBe(input.trim())
    })

    it('should not truncate forwarded messages with "Begin forwarded message:" header', () => {
      const input = `Begin forwarded message:

From: john@example.com
Subject: Test
Date: January 15, 2024 at 10:30:00 AM PST

This is forwarded content.
> Quoted text should be preserved
> in forwarded messages.`
      const result = truncateOriginalMessage(input)
      expect(result).toBe(input.trim())
    })

    it('should not truncate forwarded messages with From/Date/Subject header block', () => {
      const input = `From: alice@example.com
Date: 2024-01-15 10:30
Subject: FYI

This is the forwarded message body.
It should be preserved completely.
> Even with quoted text`
      const result = truncateOriginalMessage(input)
      expect(result).toBe(input.trim())
    })

    it('should still truncate replies in non-forwarded messages', () => {
      const input = `This is my new reply.

From: bob@example.com
Sent: Monday, January 15, 2024

> Original message here`
      const result = truncateOriginalMessage(input)
      // Should stop at the first quoted line
      expect(result).toBe(`This is my new reply.

From: bob@example.com
Sent: Monday, January 15, 2024`)
    })
  })

  describe('edge cases', () => {
    it('should handle messages with only quoted text', () => {
      const input = `> All quoted
> No original content`
      const result = truncateOriginalMessage(input)
      expect(result).toBe('')
    })

    it('should preserve content with angle brackets that are not quotes', () => {
      const input = `Check this function: function<T>(arg: T) => T

This uses angle brackets.`
      const result = truncateOriginalMessage(input)
      expect(result).toBe(`Check this function: function<T>(arg: T) => T

This uses angle brackets.`)
    })
  })
})
