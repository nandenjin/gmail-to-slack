import { IncomingWebhookSendArguments } from '@slack/webhook'
import { props } from './props'

function prepareEmailFrom(from: string) {
  // Truncate if the length of from is too long
  // todo - Preserve domain or whole email address if possible
  if (from.length > 50) {
    const postfix = '...'
    from = from.substring(0, 50 - postfix.length) + postfix
  }

  return from
}

function prepareEmailBody(body: string) {
  return body.substring(0, 2048)
}

export namespace slackUtil {
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
