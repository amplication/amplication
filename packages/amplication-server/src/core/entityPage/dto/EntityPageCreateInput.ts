import { Field, InputType } from '@nestjs/graphql';
import { JsonObject } from 'type-fest';
import { EntityPageSettings } from './EntityPageSettings';
import { BlockCreateInput } from '../../block/dto/BlockCreateInput';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EntityPageCreateInput extends BlockCreateInput<
  EntityPageSettings
> {
  // we need this in order to add GraphQL decorator on the actual type of settings
  @Field(() => EntityPageSettings, {
    nullable: false,
    description: undefined
  })
  settings!: EntityPageSettings & JsonObject;
}
