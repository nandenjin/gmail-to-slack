import { gmailUtil } from './gmailUtil'
import { props } from './props'
import { SlackPlatform } from './platforms/SlackPlatform'
import { DiscordPlatform } from './platforms/DiscordPlatform'
import { MessagePlatform } from './platforms/MessagePlatform'

/**
 * Handle time-based event execution
 */
export function main(): void {
  const errors: Error[] = []
  const threads = gmailUtil.getTargetThreads()

  for (let i = threads.length - 1; 0 <= i; i--) {
    const thread = threads[i]
    const { subject, body, from } = gmailUtil.getThreadContent(thread)

    console.log(`Forwarding the thread... : "${subject}"`)

    try {
      const url = props.getWebhookUrl()
      const platform = props.getPlatformFromUrl(url)
      let messagePlatform: MessagePlatform

      if (platform === 'slack') {
        messagePlatform = new SlackPlatform()
      } else if (platform === 'discord') {
        messagePlatform = new DiscordPlatform()
      } else {
        throw new Error('Unsupported platform')
      }

      // Post to the detected platform for each thread
      console.log(
        messagePlatform.postMessage(
          url,
          messagePlatform.composeMessage(from, subject, body)
        )
      )
    } catch (e) {
      console.error('Failed to forwarding!')
      console.error(e)

      errors.push(e)

      continue
    }

    // Remove label from thread
    gmailUtil.resolveThread(thread)
  }

  // Finish with "error" state when there is at least one error
  if (errors.length > 0) {
    throw new Error('Failed to forwarding!')
  }
}

/**
 * Handle HTTP GET request
 */
export function doGet(): GoogleAppsScript.HTML.HtmlOutput {
  return HtmlService.createHtmlOutputFromFile('config')
}
