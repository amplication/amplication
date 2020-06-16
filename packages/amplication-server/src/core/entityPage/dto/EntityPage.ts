import { InterfaceType, Field } from '@nestjs/graphql';
import { IBlock } from 'src/models';
import { EnumEntityPagePageType } from './EnumEntityPagePageType';

// Should extend IBlock in GraphQL, support for Type GraphQL has not arrived yet
@InterfaceType({
  resolveType: value => value.pageType
})
export class EntityPage<T> extends IBlock {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  entityId!: string;

  pageType: EnumEntityPagePageType;

  settings: T;
}
