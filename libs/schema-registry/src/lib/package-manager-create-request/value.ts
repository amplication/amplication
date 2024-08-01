import { PackagesGenerationRequest } from "@amplication/code-gen-types";
import { IsString } from "class-validator";

export class Value {
  @IsString()
  resourceId!: string;

  packages!: PackagesGenerationRequest;
}
