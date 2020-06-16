import { Field, InputType } from '@nestjs/graphql';
import { JsonValue } from 'type-fest';
import { EntityPageCreateInput } from './EntityPageCreateInput';
import { EntityPageSingleRecordSettings } from './EntityPageSingleRecordSettings';

@InputType({
  isAbstract: true,
  description: undefined
})
export class SingleRecordEntityPageCreateInput extends EntityPageCreateInput {
  @Field(() => EntityPageSingleRecordSettings, {
    nullable: true,
    description: undefined
  })
  settings?: EntityPageSingleRecordSettings & JsonValue;
}
