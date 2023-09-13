import { IncomingWebhookSendArguments } from '@slack/webhook'
import { props } from './props'

export namespace slackUtil {
  export function prepareEmailFrom(from: string) {
    // Truncate if the length of from is too long
    // todo - Preserve domain or whole email address if possible
    if (from.length > 50) {
      const postfix = '...'
      from = from.substring(0, 50 - postfix.length) + postfix
    }

    return from
  }

  export function prepareEmailBody(body: string) {
    return body
      .replace(/\n-+\s*Original message\s*-+\n[\s\S]*$/i, '')
      .replace(/\n\d{4}.+? \d{1,2}:\d{2} .+?<.+?@.+?>:\s+>[\s\S]*$/i, '')
      .replace(/\s*$/, '')
      .substring(0, 2048)
  }

  /**
   * Compose message for Slack
   * @param from Sender of the email
   * @param subject Subject of the email
   * @param body Body of the email
   */
  export function composeMessage(
    from: string,
    subject: string,
    body: string
  ): IncomingWebhookSendArguments {
    return {
      username: prepareEmailFrom(from),
      text: '',
      attachments: [
        {
          title: subject,
          text: prepareEmailBody(body),
        },
      ],
    }
  }

  /** Post message to Slack by Incoming Webhook.
   * @param msg Argument for Incoming Webhook
   */
  export function postMessage(msg: IncomingWebhookSendArguments): void {
    const url = props.getSlackUrl()
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
  }
}
