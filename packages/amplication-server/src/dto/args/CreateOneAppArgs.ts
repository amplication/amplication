import { ArgsType, Field } from '@nestjs/graphql';
import { AppCreateInput } from '../inputs';

@ArgsType()
export class CreateOneAppArgs {
  @Field(_type => AppCreateInput, { nullable: false })
  data!: AppCreateInput;
}
