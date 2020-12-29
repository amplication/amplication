import * as graphql from "@nestjs/graphql";
import * as nestAccessControl from "nest-access-control";
// @ts-ignore
import * as gqlUserRoles from "../auth/gqlUserRoles.decorator";

declare interface WHERE_UNIQUE_INPUT {}
declare interface RELATED_ENTITY_WHERE_INPUT {}

declare interface ENTITY {
  id: string;
}
declare class RELATED_ENTITY {}

declare interface SERVICE {
  findOne(args: {
    where: WHERE_UNIQUE_INPUT;
  }): {
    PROPERTY(): Promise<RELATED_ENTITY>;
  };
}

declare const ENTITY_NAME: string;
declare const RELATED_ENTITY_NAME: string;

export class Mixin {
  constructor(
    private readonly service: SERVICE,
    private readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {}

  @graphql.ResolveField(() => RELATED_ENTITY, { nullable: true })
  @nestAccessControl.UseRoles({
    resource: ENTITY_NAME,
    action: "read",
    possession: "any",
  })
  async FIND_ONE(
    @graphql.Parent() parent: ENTITY,
    @gqlUserRoles.UserRoles() userRoles: string[]
  ): Promise<RELATED_ENTITY | null> {
    const permission = this.rolesBuilder.permission({
      role: userRoles,
      action: "read",
      possession: "any",
      resource: RELATED_ENTITY_NAME,
    });
    const result = await this.service
      .findOne({ where: { id: parent.id } })
      .PROPERTY();

    if (!result) {
      return null;
    }
    return permission.filter(result);
  }
}
