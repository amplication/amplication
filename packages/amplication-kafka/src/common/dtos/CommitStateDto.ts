export class CommitStateDto {
  constructor(public actionStepId: string,
              public message: string,
              public state: "Success" | "Running" | "Failed",
              public meta: { [key: string]: string } = {}) {
  }
}