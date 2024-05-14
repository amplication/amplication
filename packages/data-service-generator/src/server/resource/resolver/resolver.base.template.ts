import * as graphql from "@nestjs/graphql";
import { GraphQLError } from "graphql";
import { isRecordNotFoundError } from "../../prisma.util";
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
declare interface COUNT_ARGS {
  where: WHERE_INPUT;
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
  CREATE_FUNCTION(args: { data: CREATE_INPUT }): Promise<ENTITY>;
  count(args: COUNT_ARGS): Promise<number>;
  FIND_MANY_FUNCTION(args: FIND_MANY_ARGS): Promise<ENTITY[]>;
  FIND_ONE_FUNCTION(args: {
    where: WHERE_UNIQUE_INPUT;
  }): Promise<ENTITY | null>;
  UPDATE_FUNCTION(args: {
    where: WHERE_UNIQUE_INPUT;
    data: UPDATE_INPUT;
  }): Promise<ENTITY>;
  DELETE_FUNCTION(args: { where: WHERE_UNIQUE_INPUT }): Promise<ENTITY>;
}

declare const ENTITY_NAME: string;
@graphql.Resolver(() => ENTITY)
export class RESOLVER_BASE {
  constructor(protected readonly service: SERVICE) {}

  async META_QUERY(
    @graphql.Args() args: COUNT_ARGS
  ): Promise<MetaQueryPayload> {
    const result = await this.service.count(args);
    return {
      count: result,
    };
  }

  @graphql.Query(() => [ENTITY])
  async ENTITIES_QUERY(
    @graphql.Args() args: FIND_MANY_ARGS
  ): Promise<ENTITY[]> {
    return this.service.FIND_MANY_FUNCTION(args);
  }

  @graphql.Query(() => ENTITY, { nullable: true })
  async ENTITY_QUERY(
    @graphql.Args() args: FIND_ONE_ARGS
  ): Promise<ENTITY | null> {
    const result = await this.service.FIND_ONE_FUNCTION(args);
    if (result === null) {
      return null;
    }
    return result;
  }

  @graphql.Mutation(() => ENTITY)
  async CREATE_MUTATION(@graphql.Args() args: CREATE_ARGS): Promise<ENTITY> {
    return await this.service.CREATE_FUNCTION({
      ...args,
      data: CREATE_DATA_MAPPING,
    });
  }

  @graphql.Mutation(() => ENTITY)
  async UPDATE_MUTATION(
    @graphql.Args() args: UPDATE_ARGS
  ): Promise<ENTITY | null> {
    try {
      return await this.service.UPDATE_FUNCTION({
        ...args,
        data: UPDATE_DATA_MAPPING,
      });
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new GraphQLError(
          `No resource was found for ${JSON.stringify(args.where)}`
        );
      }
      throw error;
    }
  }

  @graphql.Mutation(() => ENTITY)
  async DELETE_MUTATION(
    @graphql.Args() args: DELETE_ARGS
  ): Promise<ENTITY | null> {
    try {
      return await this.service.DELETE_FUNCTION(args);
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new GraphQLError(
          `No resource was found for ${JSON.stringify(args.where)}`
        );
      }
      throw error;
    }
  }
}
