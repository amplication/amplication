import { IsInstance, IsString } from "class-validator";

export class Value {
  @IsString()
  buildId!: string;

  /**
   * @codeGeneratorVersion a calculation between the actual version and the selectionStrategy
   * @example actual version: 1.2.3, selectionStrategy: LATEST_MINOR => 1.3.0
   */
  @IsString()
  codeGeneratorVersion!: string;

  @IsInstance(Error)
  error!: Error;
}
