export abstract class MessagePlatform {
  abstract composeMessage(from: string, subject: string, body: string): any;
  abstract postMessage(msg: any): void;
}
