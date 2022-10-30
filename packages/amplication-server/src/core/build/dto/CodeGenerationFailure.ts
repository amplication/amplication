import { IsString } from 'class-validator';
export class CodeGenerationFailure {
  @IsString()
  buildId!: string;
}
