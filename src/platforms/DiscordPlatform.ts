import { limitLines } from '../util/content'
import { truncateOriginalMessage } from '../util/email'
import { MessagePlatform } from './MessagePlatform'
import { TemporaryWebhookError } from '../util/TemporaryWebhookError'
import type {
  RESTPostAPIWebhookWithTokenJSONBody,
  RESTPostAPIWebhookWithTokenWaitResult,
} from 'discord-api-types/v10'

const MAX_BODY_LINES = +(
  PropertiesService.getScriptProperties().getProperty('maxBodyLines') || 15
)

export class DiscordPlatform implements MessagePlatform {
  prepareEmailFrom(from: string) {
    return from
  }

  prepareEmailBody(body: string): string {
    body =
      // Truncate original messages
      truncateOriginalMessage(body)
        // Remove multiple line-breaks
        .replace(/\n{3,}/g, '\n\n')

    body = limitLines(body, 30, MAX_BODY_LINES)
    return body
  }

  composeMessage(
    from: string,
    subject: string,
    body: string
  ): RESTPostAPIWebhookWithTokenJSONBody {
    return {
      embeds: [
        {
          title: subject,
          description: this.prepareEmailBody(body),
          author: {
            name: this.prepareEmailFrom(from),
          },
        },
      ],
    }
  }

  postMessage(
    url: string,
    msg: RESTPostAPIWebhookWithTokenJSONBody
  ): RESTPostAPIWebhookWithTokenWaitResult {
    // Add query parameter to wait for the response
    if (!url.includes('?')) url += '?'
    else url += '&'
    url += 'wait=true'

    const response = UrlFetchApp.fetch(url.toString(), {
      method: 'post',
      payload: JSON.stringify(msg),
      contentType: 'application/json',
      muteHttpExceptions: true,
    })

    const responseCode = response.getResponseCode()
    if (200 <= responseCode && responseCode < 300) {
      console.log('Successfully forwarded.')
      return JSON.parse(response.getContentText())
    } else if (responseCode === 429 || (500 <= responseCode && responseCode < 600)) {
      console.log('Payload: ', msg)
      console.info('Response: ', response.getContentText())
      throw new TemporaryWebhookError(responseCode)
    } else {
      console.log('Payload: ', msg)
      console.error('Response: ', response.getContentText())
      throw new Error('Webhook responded with error code:' + responseCode)
    }
  }
}
