import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import * as errors from "../errors";

declare interface SERVICE {}

declare const RESOURCE: string;

@swagger.ApiTags(RESOURCE)
@common.Controller(RESOURCE)
export class CONTROLLER {
  constructor(protected readonly service: SERVICE) {}
}
