import { ArgsType, Field } from '@nestjs/graphql';
import { EntityVersionCreateInput } from './EntityVersionCreateInput';

@ArgsType()
export class CreateOneEntityVersionArgs {
  @Field(() => EntityVersionCreateInput, { nullable: false })
  data!: EntityVersionCreateInput;
}
