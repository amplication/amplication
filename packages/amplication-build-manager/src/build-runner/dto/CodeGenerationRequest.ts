import { DSGResourceData } from "@amplication/code-gen-types";

export class CodeGenerationRequest {
  resourceId!: string;
  buildId!: string;
  dsgResourceData!: DSGResourceData;
}
