import { ArgsType, Field } from '@nestjs/graphql';
import { AppCreateInput } from './AppCreateInput';

@ArgsType()
export class CreateOneAppArgs {
  @Field(() => AppCreateInput, { nullable: false })
  data!: AppCreateInput;
}
