import { Field, ObjectType } from '@nestjs/graphql';
import { IBlock } from 'src/models';
import { EntityPage } from './EntityPage';
import { EntityPageSingleRecordSettings } from './EntityPageSingleRecordSettings';

@ObjectType({
  implements: [EntityPage, IBlock],
  isAbstract: true
})
export class SingleRecordEntityPage extends EntityPage<
  EntityPageSingleRecordSettings
> {
  @Field(() => EntityPageSingleRecordSettings, {
    nullable: false
  })
  settings!: EntityPageSingleRecordSettings;
}
