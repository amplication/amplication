import * as graphql from "@nestjs/graphql";

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
declare const FIND_MANY_FIELD_NAME: string;

export class Mixin {
  constructor(private readonly service: SERVICE) {}

  @graphql.ResolveField(() => [RELATED_ENTITY], { name: FIND_MANY_FIELD_NAME })
  async FIND_MANY(
    @graphql.Parent() parent: ENTITY,
    @graphql.Args() args: ARGS
  ): Promise<RELATED_ENTITY[]> {
    const results = await this.service.FIND_PROPERTY(parent.id, args);

    if (!results) {
      return [];
    }

    return results;
  }
}
