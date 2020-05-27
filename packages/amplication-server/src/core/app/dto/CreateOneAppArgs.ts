import { ArgsType, Field } from '@nestjs/graphql';
import { AppCreateInput } from './';

@ArgsType()
export class CreateOneAppArgs {
  @Field(_type => AppCreateInput, { nullable: false })
  data!: AppCreateInput;
}
