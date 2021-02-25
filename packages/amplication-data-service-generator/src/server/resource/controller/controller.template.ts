import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import * as nestAccessControl from "nest-access-control";

declare interface SERVICE {}

declare const RESOURCE: string;

declare class CONTROLLER_BASE {
  protected readonly service: SERVICE;
  protected rolesBuilder: nestAccessControl.RolesBuilder;
  constructor(service: SERVICE, rolesBuilder: nestAccessControl.RolesBuilder);
}

@swagger.ApiBasicAuth()
@swagger.ApiTags(RESOURCE)
@common.Controller(RESOURCE)
export class CONTROLLER extends CONTROLLER_BASE {
  constructor(
    protected readonly service: SERVICE,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }
}
