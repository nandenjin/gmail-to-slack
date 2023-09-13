export namespace props {
  enum PropertyKey {
    SLACK_URL = 'slackUrl',
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
}
