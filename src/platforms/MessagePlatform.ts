export interface MessagePlatform {
  composeMessage(from: string, subject: string, body: string): unknown
  postMessage(url: string, msg: ReturnType<this['composeMessage']>): unknown
}
