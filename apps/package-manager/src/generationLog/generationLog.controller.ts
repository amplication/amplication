import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import * as nestAccessControl from "nest-access-control";
import { GenerationLogService } from "./generationLog.service";
import { GenerationLogControllerBase } from "./base/generationLog.controller.base";

@swagger.ApiTags("generationLogs")
@common.Controller("generationLogs")
export class GenerationLogController extends GenerationLogControllerBase {
  constructor(
    protected readonly service: GenerationLogService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }
}
