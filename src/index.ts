import {
  getTargetThreads,
  getThreadContent,
  resolveThread,
} from './gmailUtil'
import { SlackPlatform } from './platforms/SlackPlatform'
import { DiscordPlatform } from './platforms/DiscordPlatform'
import { MessagePlatform } from './platforms/MessagePlatform'
import { TemporaryWebhookError } from './util/TemporaryWebhookError'
import confgHtml from './config.html?url'

// Export functions for client-side (GAS HTML Service)
import {
  getUserGmailLabels,
  getGmailLabelName,
  getWebhookUrl,
  setWebhookUrl,
  setGmailLabel,
  getPlatformFromUrl,
} from './props'

global.getUserGmailLabels = getUserGmailLabels
global.getGmailLabelName = getGmailLabelName
global.getWebhookUrl = getWebhookUrl
global.setWebhookUrl = setWebhookUrl
global.setGmailLabel = setGmailLabel

/**
 * Handle time-based event execution
 */
function main(): void {
  const errors: Error[] = []
  const threads = getTargetThreads()

  for (let i = threads.length - 1; 0 <= i; i--) {
    const thread = threads[i]
    const { subject, body, from } = getThreadContent(thread)

    console.log(`Forwarding the thread... : "${subject}"`)

    try {
      const url = getWebhookUrl()
      const platform = getPlatformFromUrl(url)
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
      if (e instanceof TemporaryWebhookError) {
        console.info('Ignoring temporary webhook error:', e.message)
        continue
      }

      console.error('Failed to forwarding!')
      console.error(e)

      errors.push(e)

      continue
    }

    // Remove label from thread
    resolveThread(thread)
  }

  // Finish with "error" state when there is at least one error
  if (errors.length > 0) {
    throw new Error('Failed to forwarding!')
  }
}

global.main = main

/**
 * Handle HTTP GET request
 */
function doGet(): GoogleAppsScript.HTML.HtmlOutput {
  return HtmlService.createHtmlOutputFromFile(confgHtml.replace(/^\//, ''))
}

global.doGet = doGet
