export class CodeGenerationFailureDto {
  resourceId!: string;
  buildId!: string;
  error!: Error;
}
