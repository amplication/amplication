import * as common from "@nestjs/common";
import * as graphql from "@nestjs/graphql";
import * as nestAccessControl from "nest-access-control";
// @ts-ignore
import * as gqlUserRoles from "../auth/gqlUserRoles.decorator";
// @ts-ignore
import { AclFilterResponseInterceptor } from "../../interceptors/aclFilterResponse.interceptor";

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
  constructor(private readonly service: SERVICE) {}

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @graphql.ResolveField(() => RELATED_ENTITY, { nullable: true })
  @nestAccessControl.UseRoles({
    resource: RELATED_ENTITY_NAME,
    action: "read",
    possession: "any",
  })
  async FIND_ONE(
    @graphql.Parent() parent: ENTITY
  ): Promise<RELATED_ENTITY | null> {
    const result = await this.service.GET_PROPERTY(parent.id);

    if (!result) {
      return null;
    }
    return result;
  }
}
