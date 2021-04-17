import { IncomingWebhookSendArguments } from '@slack/webhook'

enum PropertyKey {
  SLACK_URL = 'slackUrl',
  GMAIL_LABEL = 'gmailLabel',
}

/**
 * Handle time-based event execution
 */
export function main(): void {
  const labelName = getGmailLabel()

  if (!labelName || labelName.length === 0) {
    console.info('Please configure label to be used to forward. Abort')
    return
  }

  // Get the label and associated threads
  const label = GmailApp.getUserLabelByName(labelName)
  const threads = label.getThreads()

  for (let i = threads.length - 1; 0 <= i; i--) {
    const thread = threads[i]
    const message = thread.getMessages().pop()
    const subject = message.getSubject()
    const body = message.getPlainBody()
    const from = message.getFrom()

    console.log(`Forwarding the thread... : "${subject}"`)

    // Post to Slack for each thread
    postToSlack({
      username: from,
      text: '',
      attachments: [
        {
          title: subject,
          text: body,
        },
      ],
    })

    // Remove label from thread
    thread.removeLabel(label)
  }
}

/**
 * Handle HTTP GET request
 */
export function doGet(): GoogleAppsScript.HTML.HtmlOutput {
  return HtmlService.createHtmlOutputFromFile('config')
}

/**
 * Acquire signed-in user's email
 * @returns Email address that of current signed-in user
 */
export function getUserEmail(): string {
  return Session.getActiveUser().getEmail()
}

/**
 * Acquire user label of gmail
 * @returns List of label name
 */
export function getUserGmailLabels(): string[] {
  return GmailApp.getUserLabels().map((label) => label.getName())
}

/**
 * Get label that is currently set
 */
export function getGmailLabel(): string {
  return PropertiesService.getScriptProperties().getProperty(
    PropertyKey.GMAIL_LABEL
  )
}

/**
 * Set label to mark up
 * @param label Name of label
 * @returns
 */
export function setGmailLabel(label: string): string {
  PropertiesService.getScriptProperties().setProperty(
    PropertyKey.GMAIL_LABEL,
    label
  )
  return label
}

/**
 * Get Slack webhook URL that is currently set
 */
export function getSlackUrl(): string {
  return PropertiesService.getScriptProperties().getProperty(
    PropertyKey.SLACK_URL
  )
}

/**
 * Set Slack webhook URL
 * @param url URL to be set
 * @returns New URL
 */
export function setSlackUrl(url: string): string {
  PropertiesService.getScriptProperties().setProperty(
    PropertyKey.SLACK_URL,
    url
  )
  return url
}

/** Post message to Slack by Incoming Webhook.
 * @param msg Argument for Incoming Webhook
 */
function postToSlack(msg: IncomingWebhookSendArguments): void {
  const url = PropertiesService.getScriptProperties().getProperty(
    PropertyKey.SLACK_URL
  )

  UrlFetchApp.fetch(url, {
    method: 'post',
    payload: 'payload=' + encodeURIComponent(JSON.stringify(msg)),
  })
}
