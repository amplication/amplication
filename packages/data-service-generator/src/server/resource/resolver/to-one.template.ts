import * as graphql from "@nestjs/graphql";
declare interface ENTITY {
  id: string;
}
declare class RELATED_ENTITY {}

declare interface SERVICE {
  GET_PROPERTY(parentId: string): Promise<RELATED_ENTITY>;
}

declare const ENTITY_NAME: string;
declare const FIND_ONE_FIELD_NAME: string;

export class Mixin {
  constructor(private readonly service: SERVICE) {}

  @graphql.ResolveField(() => RELATED_ENTITY, {
    nullable: true,
    name: FIND_ONE_FIELD_NAME,
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
