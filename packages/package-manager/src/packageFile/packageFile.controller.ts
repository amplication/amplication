import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import * as nestAccessControl from "nest-access-control";
import { PackageFileService } from "./packageFile.service";
import { PackageFileControllerBase } from "./base/packageFile.controller.base";

@swagger.ApiTags("packageFiles")
@common.Controller("packageFiles")
export class PackageFileController extends PackageFileControllerBase {
  constructor(
    protected readonly service: PackageFileService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }
}
