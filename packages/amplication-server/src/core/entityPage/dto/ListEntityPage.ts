import { Field, ObjectType } from '@nestjs/graphql';
import { IBlock } from 'src/models';
import { EntityPage } from './EntityPage';
import { EntityPageListSettings } from './EntityPageListSettings';

@ObjectType({
  implements: [IBlock, EntityPage],
  isAbstract: true
})
export class ListEntityPage extends EntityPage<EntityPageListSettings> {
  @Field(() => EntityPageListSettings, {
    nullable: false
  })
  settings!: EntityPageListSettings;
}
