import * as graphql from "@nestjs/graphql";
import { RolesBuilder, UseRoles, UserRoles } from "nest-access-control";

declare interface RELATED_ENTITY_WHERE_INPUT {}

declare interface ENTITY {
  id: string;
}
declare class RELATED_ENTITY {}
declare interface ARGS {
  where: RELATED_ENTITY_WHERE_INPUT;
}

declare interface SERVICE {
  FIND_PROPERTY(
    parentId: string,
    args: RELATED_ENTITY_WHERE_INPUT
  ): Promise<RELATED_ENTITY[]>;
}

declare const ENTITY_NAME: string;
declare const RELATED_ENTITY_NAME: string;

export class Mixin {
  constructor(
    private readonly service: SERVICE,
    private readonly rolesBuilder: RolesBuilder
  ) {}

  @graphql.ResolveField(() => [RELATED_ENTITY])
  @UseRoles({
    resource: ENTITY_NAME,
    action: "read",
    possession: "any",
  })
  async FIND_MANY(
    @graphql.Parent() parent: ENTITY,
    @graphql.Args() args: ARGS,
    @UserRoles() userRoles: string[]
  ): Promise<RELATED_ENTITY[]> {
    const permission = this.rolesBuilder.permission({
      role: userRoles,
      action: "read",
      possession: "any",
      resource: RELATED_ENTITY_NAME,
    });
    const results = await this.service.FIND_PROPERTY(parent.id, args);

    if (!results) {
      return [];
    }

    return results.map((result) => permission.filter(result));
  }
}
