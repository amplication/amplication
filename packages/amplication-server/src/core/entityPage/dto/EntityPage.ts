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
    nullable: false
  })
  entityId!: string;

  @Field(() => EnumEntityPageType, {
    nullable: false
  })
  pageType: EnumEntityPageType;

  @Field(() => EntityPageSingleRecordSettings, {
    nullable: true
  })
  singleRecordSettings?: EntityPageSingleRecordSettings & JsonValue;

  @Field(() => EntityPageListSettings, {
    nullable: true
  })
  listSettings?: EntityPageListSettings & JsonValue;
}
