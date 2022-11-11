import { ArgsType, Field } from '@nestjs/graphql';
import { EntityPageCreateInput } from './EntityPageCreateInput';

@ArgsType()
export class CreateEntityPageArgs {
  @Field(() => EntityPageCreateInput, { nullable: false })
  data!: EntityPageCreateInput;
}
