import { props } from './props'

/**
 * Get the label object that is currently set
 */
function getGmailLabel(): GoogleAppsScript.Gmail.GmailLabel {
  const labelName = props.getGmailLabelName()

  if (!labelName || labelName === '') {
    throw new Error('Label is not set.')
  }

  return GmailApp.getUserLabelByName(labelName)
}

export namespace gmailUtil {
  /**
   * Get threads that are labeled as targeted
   * @returns
   */
  export function getTargetThreads(): GoogleAppsScript.Gmail.GmailThread[] {
    const label = getGmailLabel()
    // Get the label and associated threads
    return label.getThreads()
  }

  /**
   * Mark the thread as completed: remove label
   * @param thread
   */
  export function resolveThread(
    thread: GoogleAppsScript.Gmail.GmailThread
  ): void {
    const label = getGmailLabel()
    thread.removeLabel(label)
  }

  /**
   * Get the content of the thread
   * @param thread
   * @returns
   */
  export function getThreadContent(thread: GoogleAppsScript.Gmail.GmailThread) {
    const message = thread.getMessages().pop()
    const subject = message.getSubject()
    const body = message.getPlainBody()
    const from = message.getFrom()

    return {
      subject,
      body,
      from,
    }
  }
}
