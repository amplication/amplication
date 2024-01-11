import { Public } from "../decorators/public.decorator";
import { Version } from "./base/Version";
import { VersionControllerBase } from "./base/version.controller.base";
import { GetCodeGeneratorVersionInput } from "./dto/GetCodeGeneratorVersionInput";
import { VersionService } from "./version.service";
import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import * as nestAccessControl from "nest-access-control";

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

  @Public()
  @common.Post("/code-generator-version")
  @swagger.ApiOkResponse({ type: [Version] })
  async getCodeGeneratorVersion(
    @common.Body() params: GetCodeGeneratorVersionInput
  ): Promise<Version> {
    return this.service.getCodeGeneratorVersion(params);
  }

  @Public()
  @common.Post("/sync")
  @swagger.ApiOkResponse({ type: [null] })
  async sync(): Promise<boolean> {
    await this.service.syncVersions();
    return true;
  }
}
