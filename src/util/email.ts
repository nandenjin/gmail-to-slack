export function truncateOriginalMessage(body: string): string {
  // Check if this is a forwarded message - if so, don't truncate
  if (isForwardedMessage(body)) {
    return body.trim()
  }

  // Split the body into lines
  const lines = body.split('\n')
  const result: string[] = []

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const trimmedLine = line.trimStart()

    // Check if this line starts a quoted section (line starting with "> ")
    if (trimmedLine.startsWith('>')) {
      // Check if this is a trailing quoted section (at the end of the message)
      // by looking ahead to see if there's any non-quoted, non-empty content after this
      let hasContentAfter = false
      for (let j = i + 1; j < lines.length; j++) {
        const futureLineTrimmed = lines[j].trimStart()
        // If we find a non-empty line that doesn't start with >, there's content after
        if (futureLineTrimmed && !futureLineTrimmed.startsWith('>')) {
          hasContentAfter = true
          break
        }
      }

      // Only truncate if this quoted section is at the end (no content after)
      if (!hasContentAfter) {
        // Stop including lines from here - this is trailing quoted text
        break
      }
    }

    // Check if this line matches an "Original message" delimiter pattern
    if (/^-+\s*Original message\s*-+$/i.test(line.trim())) {
      // Stop including lines from here - original message delimiter
      break
    }

    // Check if this line matches a Gmail-style reply header pattern
    // Common formats:
    // - "2024年1月15日 10:30 Someone <someone@example.com>:"
    // - "2024/01/15 14:00 John Doe <john@example.com>:"
    // Pattern: year (4 digits) + any text + time (H:MM) + name/email + colon
    const GMAIL_REPLY_HEADER_PATTERN = /^\d{4}.+?\d{1,2}:\d{2}.+?<.+?@.+?>:\s*$/
    if (GMAIL_REPLY_HEADER_PATTERN.test(line.trim())) {
      // Stop including lines from here - Gmail reply header
      break
    }

    // Include the line in the result
    result.push(line)
  }

  return result.join('\n').trim()
}

/**
 * Checks if a message body appears to be a forwarded message
 * @param body The email body to check
 * @returns true if the message appears to be forwarded
 */
function isForwardedMessage(body: string): boolean {
  // Common forwarded message indicators
  const forwardedPatterns = [
    // Standard forwarded message delimiters
    /^-+\s*Forwarded message\s*-+/im,
    /^Begin forwarded message:/im,
    /^Forwarded message:/im,
  ]

  // Check for standard forwarded message patterns
  if (forwardedPatterns.some((pattern) => pattern.test(body))) {
    return true
  }

  // Check for forwarded message headers (From, Date, Subject)
  // These can appear in any order within the first few lines
  const lines = body.split('\n').slice(0, 100) // Check first 100 lines only
  const hasFrom = lines.some((line) => /^\s*From:\s*.+/i.test(line))
  const hasDate = lines.some((line) => /^\s*Date:\s*.+/i.test(line))
  const hasSubject = lines.some((line) => /^\s*Subject:\s*.+/i.test(line))

  // If all three headers are present, it's likely a forwarded message
  return hasFrom && hasDate && hasSubject
}
