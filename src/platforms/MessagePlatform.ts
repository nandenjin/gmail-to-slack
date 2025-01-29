export abstract class MessagePlatform {
  abstract composeMessage(from: string, subject: string, body: string): any
  abstract postMessage(
    url: string,
    msg: ReturnType<this['composeMessage']>
  ): void
}
