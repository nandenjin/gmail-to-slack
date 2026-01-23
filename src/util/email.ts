export function truncateOriginalMessage(body: string): string {
  return body
    .replace(/\n-+\s*Original message\s*-+\n[\s\S]*$/i, '')
    .replace(/\n\d{4}.+? \d{1,2}:\d{2} .+?<.+?@.+?>:\s+>[\s\S]*$/i, '')
    .trim()
}
