import {
  IncomingWebhookSendArguments,
  IncomingWebhookResult,
} from '@slack/webhook'
import { MessagePlatform } from './MessagePlatform'
import { truncateOriginalMessage } from '../util/email'
import { limitLines } from '../util/content'

const MAX_BODY_LINES = +(
  PropertiesService.getScriptProperties().getProperty('maxBodyLines') || 15
)

export class SlackPlatform implements MessagePlatform {
  prepareEmailFrom(from: string) {
    // Truncate if the length of from is too long
    // todo - Preserve domain or whole email address if possible
    if (from.length > 50) {
      const postfix = '...'
      from = from.substring(0, 50 - postfix.length) + postfix
    }

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
  ): IncomingWebhookSendArguments {
    return {
      username: this.prepareEmailFrom(from),
      text: '',
      attachments: [
        {
          title: subject,
          text: this.prepareEmailBody(body),
        },
      ],
    }
  }

  postMessage(
    url: string,
    msg: IncomingWebhookSendArguments
  ): IncomingWebhookResult {
    const response = UrlFetchApp.fetch(url, {
      method: 'post',
      payload: 'payload=' + encodeURIComponent(JSON.stringify(msg)),
      muteHttpExceptions: true,
    })

    const responseCode = response.getResponseCode()
    if (200 <= responseCode && responseCode < 300) {
      console.log('Successfly forwarded.')
    } else {
      console.log('Payload: ', msg)
      console.error('Response: ', response.getContentText())
      throw new Error('Webhook responded with error code:' + responseCode)
    }
    return JSON.parse(response.getContentText()) as IncomingWebhookResult
  }
}
