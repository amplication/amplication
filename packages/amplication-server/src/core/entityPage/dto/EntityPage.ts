import { Field, ObjectType } from '@nestjs/graphql';
import { IBlock } from 'src/models';
import { EnumEntityPageType } from './EnumEntityPageType';
import { EntityPageSingleRecordSettings, EntityPageListSettings } from '.';
import { JsonValue } from 'type-fest';

@ObjectType({
  isAbstract: true,
  implements: [IBlock]
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
