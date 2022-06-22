
export interface IMessagePattern {
  userId: string;
  payload: { [key: string]: string },
  template: string;
}
