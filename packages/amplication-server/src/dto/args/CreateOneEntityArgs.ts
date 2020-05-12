import { ArgsType, Field } from '@nestjs/graphql';
import { EntityCreateInput } from '../inputs/EntityCreateInput';

@ArgsType()
export class CreateOneEntityArgs {
  @Field(_type => EntityCreateInput, { nullable: false })
  data!: EntityCreateInput;
}
