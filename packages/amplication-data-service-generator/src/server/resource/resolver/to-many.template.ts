import * as graphql from "@nestjs/graphql";
import * as nestAccessControl from "nest-access-control";

declare interface WHERE_UNIQUE_INPUT {}
declare interface RELATED_ENTITY_WHERE_INPUT {}

declare interface ENTITY {
  id: string;
}
declare class RELATED_ENTITY {}
declare interface ARGS {
  where: RELATED_ENTITY_WHERE_INPUT;
}

declare interface SERVICE {
  findOne(args: {
    where: WHERE_UNIQUE_INPUT;
  }): {
    PROPERTY(args: {
      where: RELATED_ENTITY_WHERE_INPUT;
    }): Promise<RELATED_ENTITY[]>;
  };
}

declare const ENTITY_NAME: string;
declare const RELATED_ENTITY_NAME: string;

export class Mixin {
  constructor(
    private readonly service: SERVICE,
    private readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {}

  @graphql.ResolveField(() => [RELATED_ENTITY])
  @nestAccessControl.UseRoles({
    resource: ENTITY_NAME,
    action: "read",
    possession: "any",
  })
  async FIND_MANY(
    @graphql.Parent() parent: ENTITY,
    @graphql.Args() args: ARGS,
    @nestAccessControl.UserRoles() userRoles: string[]
  ): Promise<RELATED_ENTITY[]> {
    const permission = this.rolesBuilder.permission({
      role: userRoles,
      action: "read",
      possession: "any",
      resource: RELATED_ENTITY_NAME,
    });
    const results = await this.service
      .findOne({ where: { id: parent.id } })
      // @ts-ignore
      .PROPERTY(args);
    return results.map((result) => permission.filter(result));
  }
}
