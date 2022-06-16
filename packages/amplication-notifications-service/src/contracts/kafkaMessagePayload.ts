export class KafkaMessagePayload {
  userId: string;
  payload: { message: string; title?: string, messageUrl?: string };
  template: string;

  constructor(
    userId: string,
    payload: { message: string; title?: string, messageUrl?: string },
    template: string
  ) {
    this.userId = userId;
    this.payload = payload;
    this.template = template;
  }
}
