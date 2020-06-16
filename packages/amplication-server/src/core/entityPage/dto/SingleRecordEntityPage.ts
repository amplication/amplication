import { Field, ObjectType } from '@nestjs/graphql';
import { IBlock } from 'src/models';
import { EntityPage } from './EntityPage';
import { EntityPageSingleRecordSettings } from './EntityPageSingleRecordSettings';
import { EnumEntityPagePageType } from './EnumEntityPagePageType';

@ObjectType({
  implements: [EntityPage, IBlock],
  isAbstract: true
})
export class SingleRecordEntityPage extends EntityPage<
  EntityPageSingleRecordSettings
> {
  pageType: EnumEntityPagePageType.SingleRecord;

  @Field(() => EntityPageSingleRecordSettings, {
    nullable: false
  })
  settings!: EntityPageSingleRecordSettings;
}
