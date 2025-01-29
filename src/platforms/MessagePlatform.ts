export abstract class MessagePlatform {
  abstract composeMessage(from: string, subject: string, body: string): unknown
  abstract postMessage(
    url: string,
    msg: ReturnType<this['composeMessage']>
  ): void
}
