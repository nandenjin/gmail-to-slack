export namespace props {
  enum PropertyKey {
    SLACK_URL = 'slackUrl', // For backward compatibility
    WEBHOOK_URL = 'webhookUrl',
    GMAIL_LABEL = 'gmailLabel',
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
  export function getGmailLabelName(): string {
    return PropertiesService.getScriptProperties().getProperty(
      PropertyKey.GMAIL_LABEL
    )
  }

  /**
   * Set label to mark up
   * @param label Name of label
   * @returns
   */
  export function setGmailLabel(labelName: string): string {
    PropertiesService.getScriptProperties().setProperty(
      PropertyKey.GMAIL_LABEL,
      labelName
    )
    return labelName
  }

  /**
   * Get webhook URL that is currently set
   */
  export function getWebhookUrl(): string {
    return (
      PropertiesService.getScriptProperties().getProperty(
        PropertyKey.WEBHOOK_URL
      ) ||
      PropertiesService.getScriptProperties().getProperty(PropertyKey.SLACK_URL) // For backward compatibility
    )
  }

  /**
   * Set webhook URL
   * @param url URL to be set
   * @returns New URL
   */
  export function setWebhookUrl(url: string): string {
    PropertiesService.getScriptProperties().setProperty(
      PropertyKey.WEBHOOK_URL,
      url
    )
    return url
  }

  /**
   * Detect platform from webhook URL
   * @param url Webhook URL
   * @returns Platform name
   */
  export function getPlatformFromUrl(url: string): string {
    if (url.includes('slack.com')) {
      return 'slack'
    } else if (url.includes('discord.com')) {
      if (url.includes('/slack')) {
        return 'slack'
      } else {
        return 'discord'
      }
    } else {
      throw new Error('Unsupported platform')
    }
  }
}
