import { slackUtil } from '../src/slackUtil'

describe('prepareEmailFrom', () => {
  it('should return the same string if the length is less than 50', () => {
    expect(slackUtil.prepareEmailFrom('example@example.com')).toBe(
      'example@example.com'
    )
    expect(
      slackUtil.prepareEmailFrom('"Test User" <example@example.com>')
    ).toBe('"Test User" <example@example.com>')
  })

  it('should truncate if the length is more than 50', () => {
    expect(
      slackUtil.prepareEmailFrom(
        '"Test User with very long name" <over50lengthemailaddress@example.com>'
      )
    ).toBe('"Test User with very long name" <over50lengthem...')
  })
})

describe('prepareEmailBody', () => {
  it('should remove original message', () => {
    expect(
      slackUtil.prepareEmailBody(
        `This is a test email.
--- Original message ----
Reply text
`
      )
    ).toBe('This is a test email.')

    expect(
      slackUtil.prepareEmailBody(
        `This is a test email.

2023/1/1 12:34 Test User <example@example.com>:

> Reply text
`
      )
    ).toBe('This is a test email.')
  })
})
