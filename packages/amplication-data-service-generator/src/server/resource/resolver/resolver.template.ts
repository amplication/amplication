import * as common from "@nestjs/common";
import * as graphql from "@nestjs/graphql";
import * as nestAccessControl from "nest-access-control";
// @ts-ignore
import * as gqlBasicAuthGuard from "../auth/gqlBasicAuth.guard";
// @ts-ignore
import * as gqlACGuard from "../auth/gqlAC.guard";

declare class ENTITY {}

declare interface SERVICE {}

declare const ENTITY_NAME: string;

declare class RESOLVER_BASE {
  protected readonly service: SERVICE;
  protected rolesBuilder: nestAccessControl.RolesBuilder;
  constructor(service: SERVICE, rolesBuilder: nestAccessControl.RolesBuilder);
}

@graphql.Resolver(() => ENTITY)
@common.UseGuards(gqlBasicAuthGuard.GqlBasicAuthGuard, gqlACGuard.GqlACGuard)
export class RESOLVER extends RESOLVER_BASE {
  constructor(
    protected readonly service: SERVICE,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }
}
