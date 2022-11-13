import { ArgsType, Field } from '@nestjs/graphql';
import { EntityCreateInput } from './EntityCreateInput';

@ArgsType()
export class CreateOneEntityArgs {
  @Field(() => EntityCreateInput, { nullable: false })
  data!: EntityCreateInput;
}
