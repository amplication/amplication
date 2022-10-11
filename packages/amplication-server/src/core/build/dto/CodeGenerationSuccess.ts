import { IsString } from 'class-validator';
export class CodeGenerationSuccessArgs {
  @IsString()
  buildId!: string;
}
