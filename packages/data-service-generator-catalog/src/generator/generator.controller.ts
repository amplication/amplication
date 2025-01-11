import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import * as nestAccessControl from "nest-access-control";
import { GeneratorService } from "./generator.service";
import { GeneratorControllerBase } from "./base/generator.controller.base";

@swagger.ApiTags("generators")
@common.Controller("generators")
export class GeneratorController extends GeneratorControllerBase {
  constructor(
    protected readonly service: GeneratorService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }
}
