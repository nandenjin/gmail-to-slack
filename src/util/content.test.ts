import { ContentUtil } from './content'

describe('limitLines', () => {
  it('should return short text as is', () => {
    const input = 'Hello World'
    const result = ContentUtil.limitLines(input)
    expect(result).toBe('Hello World')
  })

  it('should handle multiple short lines', () => {
    const input = 'Line 1\nLine 2\nLine 3'
    const result = ContentUtil.limitLines(input)
    expect(result).toBe('Line 1\nLine 2\nLine 3')
  })

  it('should truncate when virtual lines exceed maxVirtualLines', () => {
    const lines = Array(20).fill('Short line').join('\n')
    const result = ContentUtil.limitLines(lines, 30, 15)
    expect(result).toContain('(...)')
    expect(result.split('\n').length).toBeLessThan(20)
  })

  it('should count long lines as multiple virtual lines', () => {
    // A line with 90 characters should count as 3 virtual lines (90/30 = 3)
    const longLine = 'a'.repeat(90)
    const input = `${longLine}\nSecond line`
    const result = ContentUtil.limitLines(input, 30, 2)
    // Long line counts as 3 virtual lines, exceeding maxVirtualLines of 2
    expect(result).toContain('(...)')
  })

  it('should use custom maxCharsPerLine', () => {
    const longLine = 'a'.repeat(100)
    // With maxCharsPerLine=50, this counts as 2 virtual lines
    const result = ContentUtil.limitLines(longLine, 50, 5)
    expect(result).toBe(longLine)
  })

  it('should handle empty string', () => {
    const result = ContentUtil.limitLines('')
    expect(result).toBe('')
  })

  it('should handle single newline', () => {
    const result = ContentUtil.limitLines('\n')
    expect(result).toBe('\n')
  })
})
