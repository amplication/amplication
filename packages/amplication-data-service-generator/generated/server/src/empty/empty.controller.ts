import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import { EmptyService } from "./empty.service";
import { EmptyControllerBase } from "./base/empty.controller.base";

@swagger.ApiTags("empties")
@common.Controller("empties")
export class EmptyController extends EmptyControllerBase {
  constructor(protected readonly service: EmptyService) {
    super(service);
  }
}
