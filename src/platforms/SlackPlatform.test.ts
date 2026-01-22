import { SlackPlatform } from './SlackPlatform'

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
})
