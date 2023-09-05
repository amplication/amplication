import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import * as nestAccessControl from "nest-access-control";
import { VersionService } from "./version.service";
import { VersionControllerBase } from "./base/version.controller.base";

@swagger.ApiTags("versions")
@common.Controller("versions")
export class VersionController extends VersionControllerBase {
  constructor(
    protected readonly service: VersionService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }
}
