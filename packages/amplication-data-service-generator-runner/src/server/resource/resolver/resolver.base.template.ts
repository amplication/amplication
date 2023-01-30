import * as common from "@nestjs/common";
import * as graphql from "@nestjs/graphql";
import * as apollo from "apollo-server-express";
import * as nestAccessControl from "nest-access-control";
// @ts-ignore
import { GqlDefaultAuthGuard } from "../../auth/gqlDefaultAuth.guard";
// @ts-ignore
import * as gqlACGuard from "../../auth/gqlAC.guard";
// @ts-ignore
import { isRecordNotFoundError } from "../../prisma.util";
// @ts-ignore
import { MetaQueryPayload } from "../../util/MetaQueryPayload";

declare interface CREATE_INPUT {}
declare interface WHERE_INPUT {}
declare interface WHERE_UNIQUE_INPUT {}
declare interface UPDATE_INPUT {}

declare interface CREATE_ARGS {
  data: CREATE_INPUT;
}
declare interface UPDATE_ARGS {
  where: WHERE_INPUT;
  data: UPDATE_INPUT;
}
declare interface DELETE_ARGS {
  where: WHERE_UNIQUE_INPUT;
}
declare interface FIND_MANY_ARGS {
  where: WHERE_INPUT;
  skip: number | undefined;
  take: number | undefined;
}
declare interface FIND_ONE_ARGS {
  where: WHERE_UNIQUE_INPUT;
}

declare class ENTITY {}

declare const CREATE_DATA_MAPPING: CREATE_INPUT;
declare const UPDATE_DATA_MAPPING: UPDATE_INPUT;

declare interface SERVICE {
  create(args: { data: CREATE_INPUT }): Promise<ENTITY>;
  count(args: FIND_MANY_ARGS): Promise<number>;
  findMany(args: FIND_MANY_ARGS): Promise<ENTITY[]>;
  findOne(args: { where: WHERE_UNIQUE_INPUT }): Promise<ENTITY | null>;
  update(args: {
    where: WHERE_UNIQUE_INPUT;
    data: UPDATE_INPUT;
  }): Promise<ENTITY>;
  delete(args: { where: WHERE_UNIQUE_INPUT }): Promise<ENTITY>;
}

declare const ENTITY_NAME: string;

@graphql.Resolver(() => ENTITY)
@common.UseGuards(GqlDefaultAuthGuard, gqlACGuard.GqlACGuard)
export class RESOLVER_BASE {
  constructor(
    protected readonly service: SERVICE,
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {}

  @graphql.Query(() => MetaQueryPayload)
  @nestAccessControl.UseRoles({
    resource: ENTITY_NAME,
    action: "read",
    possession: "any",
  })
  async META_QUERY(
    @graphql.Args() args: FIND_MANY_ARGS
  ): Promise<MetaQueryPayload> {
    const results = await this.service.count({
      ...args,
      skip: undefined,
      take: undefined,
    });
    return {
      count: results,
    };
  }

  // @ts-ignore
  @common.UseInterceptors(AclFilterResponseInterceptor)
  @graphql.Query(() => [ENTITY])
  @nestAccessControl.UseRoles({
    resource: ENTITY_NAME,
    action: "read",
    possession: "any",
  })
  async ENTITIES_QUERY(
    @graphql.Args() args: FIND_MANY_ARGS
  ): Promise<ENTITY[]> {
    return this.service.findMany(args);
  }

  // @ts-ignore
  @common.UseInterceptors(AclFilterResponseInterceptor)
  @graphql.Query(() => ENTITY, { nullable: true })
  @nestAccessControl.UseRoles({
    resource: ENTITY_NAME,
    action: "read",
    possession: "own",
  })
  async ENTITY_QUERY(
    @graphql.Args() args: FIND_ONE_ARGS
  ): Promise<ENTITY | null> {
    const result = await this.service.findOne(args);
    if (result === null) {
      return null;
    }
    return result;
  }

  // @ts-ignore
  @common.UseInterceptors(AclValidateRequestInterceptor)
  @graphql.Mutation(() => ENTITY)
  @nestAccessControl.UseRoles({
    resource: ENTITY_NAME,
    action: "create",
    possession: "any",
  })
  async CREATE_MUTATION(@graphql.Args() args: CREATE_ARGS): Promise<ENTITY> {
    // @ts-ignore
    return await this.service.create({
      ...args,
      data: CREATE_DATA_MAPPING,
    });
  }

  // @ts-ignore
  @common.UseInterceptors(AclValidateRequestInterceptor)
  @graphql.Mutation(() => ENTITY)
  @nestAccessControl.UseRoles({
    resource: ENTITY_NAME,
    action: "update",
    possession: "any",
  })
  async UPDATE_MUTATION(
    @graphql.Args() args: UPDATE_ARGS
  ): Promise<ENTITY | null> {
    try {
      // @ts-ignore
      return await this.service.update({
        ...args,
        data: UPDATE_DATA_MAPPING,
      });
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new apollo.ApolloError(
          `No resource was found for ${JSON.stringify(args.where)}`
        );
      }
      throw error;
    }
  }

  @graphql.Mutation(() => ENTITY)
  @nestAccessControl.UseRoles({
    resource: ENTITY_NAME,
    action: "delete",
    possession: "any",
  })
  async DELETE_MUTATION(
    @graphql.Args() args: DELETE_ARGS
  ): Promise<ENTITY | null> {
    try {
      // @ts-ignore
      return await this.service.delete(args);
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new apollo.ApolloError(
          `No resource was found for ${JSON.stringify(args.where)}`
        );
      }
      throw error;
    }
  }
}
