export interface MessagePlatform {
  composeMessage(from: string, subject: string, body: string): object
  postMessage(url: string, msg: ReturnType<this['composeMessage']>): object
}
