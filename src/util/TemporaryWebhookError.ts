/**
 * Error thrown when a webhook returns a temporary error (429 or 5xx).
 * These errors should be ignored (logged as info) and not counted as fatal failures.
 */
export class TemporaryWebhookError extends Error {
  constructor(public readonly responseCode: number) {
    super('Webhook responded with temporary error code: ' + responseCode)
    this.name = 'TemporaryWebhookError'
  }
}
