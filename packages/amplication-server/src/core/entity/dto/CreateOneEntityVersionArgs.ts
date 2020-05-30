import { ArgsType, Field } from '@nestjs/graphql';
import { EntityVersionCreateInput } from './';

@ArgsType()
export class CreateOneEntityVersionArgs {
  @Field(_type => EntityVersionCreateInput, { nullable: false })
  data!: EntityVersionCreateInput;
}
