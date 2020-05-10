import { ArgsType, Field } from '@nestjs/graphql';
import { EntityVersionCreateInput } from '../inputs/EntityVersionCreateInput';

@ArgsType()
export class CreateOneEntityVersionArgs {
  @Field(_type => EntityVersionCreateInput, { nullable: false })
  data!: EntityVersionCreateInput;
}
