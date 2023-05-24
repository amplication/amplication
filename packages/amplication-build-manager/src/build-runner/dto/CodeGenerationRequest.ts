import { DSGResourceData } from "@amplication/code-gen-types";

export class CodeGenerationRequestDto {
  resourceId!: string;
  buildId!: string;
  dsgResourceData!: DSGResourceData;
}
