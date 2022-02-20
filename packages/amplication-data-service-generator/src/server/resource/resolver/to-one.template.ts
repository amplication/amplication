import * as graphql from "@nestjs/graphql";
import { RolesBuilder, UseRoles, UserRoles } from "nest-access-control";

declare interface ENTITY {
  id: string;
}
declare class RELATED_ENTITY {}

declare interface SERVICE {
  GET_PROPERTY(parentId: string): Promise<RELATED_ENTITY>;
}

declare const ENTITY_NAME: string;
declare const RELATED_ENTITY_NAME: string;

export class Mixin {
  constructor(
    private readonly service: SERVICE,
    private readonly rolesBuilder: RolesBuilder
  ) {}

  @graphql.ResolveField(() => RELATED_ENTITY, { nullable: true })
  @UseRoles({
    resource: ENTITY_NAME,
    action: "read",
    possession: "any",
  })
  async FIND_ONE(
    @graphql.Parent() parent: ENTITY,
    @UserRoles() userRoles: string[]
  ): Promise<RELATED_ENTITY | null> {
    const permission = this.rolesBuilder.permission({
      role: userRoles,
      action: "read",
      possession: "any",
      resource: RELATED_ENTITY_NAME,
    });
    const result = await this.service.GET_PROPERTY(parent.id);

    if (!result) {
      return null;
    }
    return permission.filter(result);
  }
}
