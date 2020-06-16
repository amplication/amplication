import { Field, InputType } from '@nestjs/graphql';
import { JsonValue } from 'type-fest';
import { EntityPageCreateInput } from './EntityPageCreateInput';
import { EntityPageListSettings } from './EntityPageListSettings';

@InputType({
  isAbstract: true,
  description: undefined
})
export class ListEntityPageCreateInput extends EntityPageCreateInput {
  @Field(() => EntityPageListSettings, {
    nullable: true,
    description: undefined
  })
  settings?: EntityPageListSettings & JsonValue;
}
