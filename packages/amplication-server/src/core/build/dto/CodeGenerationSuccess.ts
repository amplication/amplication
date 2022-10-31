import { IsString } from 'class-validator';
export class CodeGenerationSuccess {
  @IsString()
  buildId!: string;
}
