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
})
