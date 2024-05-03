import { IsString } from "class-validator";

export class Value {
  @IsString()
  buildId!: string;

  /**
   * @codeGeneratorVersion a calculation between the actual version and the selectionStrategy
   * @example actual version: 1.9.7, selectionStrategy: LATEST_MAJOR => 2.0.0
   */
  @IsString()
  codeGeneratorVersion!: string;
}
