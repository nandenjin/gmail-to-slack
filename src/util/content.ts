export namespace ContentUtil {
  export function limitLines(
    body: string,
    maxCharsPerLine: number = 30,
    maxVirtualLines: number = 15
  ): string {
    const originalLines = body.split('\n')

    const resultLines: string[] = []
    /** Virtual length of lines */
    let len = 0
    for (const line of originalLines) {
      len += Math.ceil(line.length / maxCharsPerLine) // Treat 30 characters as one line
      resultLines.push(line)

      // Truncate if the length of lines is too long
      if (len > maxVirtualLines) {
        resultLines.push('(...)')
        break
      }
    }

    return resultLines.join('\n')
  }
}
