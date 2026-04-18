import { DiscordPlatform } from './DiscordPlatform'
import { TemporaryWebhookError } from '../util/TemporaryWebhookError'

describe('DiscordPlatform', () => {
  describe('prepareEmailFrom', () => {
    it('should return the same string if the length is less than 50', () => {
      const discordPlatform = new DiscordPlatform()
      expect(discordPlatform.prepareEmailFrom('example@example.com')).toBe(
        'example@example.com'
      )
      expect(
        discordPlatform.prepareEmailFrom('"Test User" <example@example.com>')
      ).toBe('"Test User" <example@example.com>')
    })
  })

  describe('prepareEmailBody', () => {
    it('removes multiple line-breaks', () => {
      const discordPlatform = new DiscordPlatform()
      expect(
        discordPlatform.prepareEmailBody(
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
        getContentText: () => JSON.stringify({ id: '123' }),
      })
      const platform = new DiscordPlatform()
      expect(() =>
        platform.postMessage('https://example.com', {})
      ).not.toThrow()
    })

    it('should throw TemporaryWebhookError on 429 response', () => {
      mockFetch.mockReturnValue({
        getResponseCode: () => 429,
        getContentText: () => 'Too Many Requests',
      })
      const platform = new DiscordPlatform()
      expect(() => platform.postMessage('https://example.com', {})).toThrow(
        TemporaryWebhookError
      )
    })

    it('should throw TemporaryWebhookError on 500 response', () => {
      mockFetch.mockReturnValue({
        getResponseCode: () => 500,
        getContentText: () => 'Internal Server Error',
      })
      const platform = new DiscordPlatform()
      expect(() => platform.postMessage('https://example.com', {})).toThrow(
        TemporaryWebhookError
      )
    })

    it('should throw TemporaryWebhookError on 503 response', () => {
      mockFetch.mockReturnValue({
        getResponseCode: () => 503,
        getContentText: () => 'Service Unavailable',
      })
      const platform = new DiscordPlatform()
      expect(() => platform.postMessage('https://example.com', {})).toThrow(
        TemporaryWebhookError
      )
    })

    it('should throw generic Error on 4xx (non-429) response', () => {
      mockFetch.mockReturnValue({
        getResponseCode: () => 400,
        getContentText: () => 'Bad Request',
      })
      const platform = new DiscordPlatform()
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
