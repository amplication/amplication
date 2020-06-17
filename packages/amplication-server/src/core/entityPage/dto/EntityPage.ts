import { InterfaceType, Field } from '@nestjs/graphql';
import { IBlock } from 'src/models';
import { EnumEntityPageType } from './EnumEntityPageType';
import { EntityPageSingleRecordSettings, EntityPageListSettings } from '.';
import { JsonValue } from 'type-fest';

// Should extend IBlock in GraphQL, support for Type GraphQL has not arrived yet
@InterfaceType({
  resolveType: value => value.pageType
})
export class EntityPage extends IBlock {
  @Field(() => String, {
    nullable: false,
    description: undefined
  })
  entityId!: string;

  pageType: EnumEntityPageType;

  singleRecordSettings!: (EntityPageSingleRecordSettings | null) & JsonValue;
  listSettings!: (EntityPageListSettings | null) & JsonValue;
}
