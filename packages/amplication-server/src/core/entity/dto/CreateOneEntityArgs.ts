import { ArgsType, Field } from '@nestjs/graphql';
import { EntityCreateInput } from './';

@ArgsType()
export class CreateOneEntityArgs {
  @Field(_type => EntityCreateInput, { nullable: false })
  data!: EntityCreateInput;
}
