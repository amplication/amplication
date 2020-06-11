import { Field, ObjectType } from '@nestjs/graphql';
import { Block } from 'src/models/index';
import { EntityPageSettings } from './EntityPageSettings';

@ObjectType({
  implements: Block,
  isAbstract: true,
  description: undefined
})
export class EntityPage extends Block<EntityPageSettings> {
  // we need this in order to add GraphQL decorator on the actual type of settings
  @Field(() => EntityPageSettings, {
    nullable: true,
    description: undefined
  })
  settings?: EntityPageSettings;
}
