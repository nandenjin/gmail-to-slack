import { MessagePlatform } from './MessagePlatform'
import { RESTPostAPIWebhookWithTokenJSONBody } from 'discord-api-types/v10'

export class DiscordPlatform extends MessagePlatform {
  prepareEmailFrom(from: string) {
    // Truncate if the length of from is too long
    if (from.length > 50) {
      const postfix = '...'
      from = from.substring(0, 50 - postfix.length) + postfix
    }

    return from
  }

  prepareEmailBody(body: string): string {
    const originalLines = body
      // Truncate original messages
      .replace(/\n-+\s*Original message\s*-+\n[\s\S]*$/i, '')
      .replace(/\n\d{4}.+? \d{1,2}:\d{2} .+?<.+?@.+?>:\s+>[\s\S]*$/i, '')

      // Remove spaces at the end of body
      .replace(/\s*$/, '')

      // Remove multiple line-breaks
      .replace(/\n{3,}/g, '\n\n')

      .split('\n')

    const resultLines: string[] = []
    /** Virtual length of lines */
    let len = 0
    for (const line of originalLines) {
      len += Math.ceil(line.length / 30) // Treat 30 characters as one line
      resultLines.push(line)

      // Truncate if the length of lines is too long
      if (len > 15) {
        resultLines.push('(...)')
        break
      }
    }
    return resultLines.join('\n')
  }

  composeMessage(
    from: string,
    subject: string,
    body: string
  ): RESTPostAPIWebhookWithTokenJSONBody {
    return {
      username: this.prepareEmailFrom(from),
      content: `**${subject}**\n${this.prepareEmailBody(body)}`,
    }
  }

  postMessage(url: string, msg: RESTPostAPIWebhookWithTokenJSONBody): void {
    const response = UrlFetchApp.fetch(url, {
      method: 'post',
      payload: JSON.stringify(msg),
      contentType: 'application/json',
      muteHttpExceptions: true,
    })

    const responseCode = response.getResponseCode()
    if (200 <= responseCode && responseCode < 300) {
      console.log('Successfully forwarded.')
    } else {
      console.log('Payload: ', msg)
      console.error('Response: ', response.getContentText())
      throw new Error('Webhook responded with error code:' + responseCode)
    }
  }
}
