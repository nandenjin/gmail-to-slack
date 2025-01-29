import { DiscordPlatform } from './DiscordPlatform'

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

    it('should truncate if the length is more than 50', () => {
      const discordPlatform = new DiscordPlatform()
      expect(
        discordPlatform.prepareEmailFrom(
          '"Test User with very long name" <over50lengthemailaddress@example.com>'
        )
      ).toBe('"Test User with very long name" <over50lengthem...')
    })
  })

  describe('prepareEmailBody', () => {
    it('should remove original message', () => {
      const discordPlatform = new DiscordPlatform()
      expect(
        discordPlatform.prepareEmailBody(
          `This is a test email.
--- Original message ----
Reply text
`
        )
      ).toBe('This is a test email.')

      expect(
        discordPlatform.prepareEmailBody(
          `This is a test email.

2023/1/1 12:34 Test User <example@example.com>:

> Reply text
`
        )
      ).toBe('This is a test email.')
    })

    it('removes spaces at the end of body', () => {
      const discordPlatform = new DiscordPlatform()
      expect(discordPlatform.prepareEmailBody(`This is a test email.   `)).toBe(
        'This is a test email.'
      )
    })

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
        `
This is a test email.

This should be kept 👆

This should be removed 👆`
      )
    })
  })
})
