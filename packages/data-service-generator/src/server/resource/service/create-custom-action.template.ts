declare class RETURN_TYPE {}
declare class INPUT_TYPE {}

export class Mixin {
  async ACTION_NAME(input: INPUT_TYPE): Promise<RETURN_TYPE> {
    throw new Error("Not implemented");
  }
}
