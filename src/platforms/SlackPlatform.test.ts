import { SlackPlatform } from './SlackPlatform'
import { TemporaryWebhookError } from '../util/TemporaryWebhookError'

describe('SlackPlatform', () => {
  describe('prepareEmailFrom', () => {
    it('should return the same string if the length is less than 50', () => {
      const slackPlatform = new SlackPlatform()
      expect(slackPlatform.prepareEmailFrom('example@example.com')).toBe(
        'example@example.com'
      )
      expect(
        slackPlatform.prepareEmailFrom('"Test User" <example@example.com>')
      ).toBe('"Test User" <example@example.com>')
    })

    it('should truncate if the length is more than 50', () => {
      const slackPlatform = new SlackPlatform()
      expect(
        slackPlatform.prepareEmailFrom(
          '"Test User with very long name" <over50lengthemailaddress@example.com>'
        )
      ).toBe('"Test User with very long name" <over50lengthem...')
    })
  })

  describe('prepareEmailBody', () => {
    it('removes multiple line-breaks', () => {
      const slackPlatform = new SlackPlatform()
      expect(
        slackPlatform.prepareEmailBody(
          `
This is a test email.

This should be kept 👆


This should be removed 👆`
        )
      ).toBe(
        `This is a test email.

This should be kept 👆

This should be removed 👆`
      )
    })
  })

  describe('postMessage', () => {
    const mockFetch = vi.fn()

    beforeEach(() => {
      global.UrlFetchApp = { fetch: mockFetch } as unknown as typeof UrlFetchApp
    })

    afterEach(() => {
      vi.clearAllMocks()
    })

    it('should not throw on 2xx response', () => {
      mockFetch.mockReturnValue({
        getResponseCode: () => 200,
        getContentText: () => JSON.stringify({ ok: true }),
      })
      const platform = new SlackPlatform()
      expect(() =>
        platform.postMessage('https://example.com', {})
      ).not.toThrow()
    })

    it('should throw TemporaryWebhookError on 429 response', () => {
      mockFetch.mockReturnValue({
        getResponseCode: () => 429,
        getContentText: () => 'Too Many Requests',
      })
      const platform = new SlackPlatform()
      expect(() => platform.postMessage('https://example.com', {})).toThrow(
        TemporaryWebhookError
      )
    })

    it('should throw TemporaryWebhookError on 500 response', () => {
      mockFetch.mockReturnValue({
        getResponseCode: () => 500,
        getContentText: () => 'Internal Server Error',
      })
      const platform = new SlackPlatform()
      expect(() => platform.postMessage('https://example.com', {})).toThrow(
        TemporaryWebhookError
      )
    })

    it('should throw TemporaryWebhookError on 503 response', () => {
      mockFetch.mockReturnValue({
        getResponseCode: () => 503,
        getContentText: () => 'Service Unavailable',
      })
      const platform = new SlackPlatform()
      expect(() => platform.postMessage('https://example.com', {})).toThrow(
        TemporaryWebhookError
      )
    })

    it('should throw generic Error on 4xx (non-429) response', () => {
      mockFetch.mockReturnValue({
        getResponseCode: () => 400,
        getContentText: () => 'Bad Request',
      })
      const platform = new SlackPlatform()
      let thrownError: unknown

      try {
        platform.postMessage('https://example.com', {})
      } catch (error) {
        thrownError = error
      }

      expect(thrownError).toBeInstanceOf(Error)
      expect(thrownError).not.toBeInstanceOf(TemporaryWebhookError)
    })
  })
})
