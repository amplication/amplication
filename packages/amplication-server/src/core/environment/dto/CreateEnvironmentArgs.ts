import { ArgsType, Field } from '@nestjs/graphql';
import { EnvironmentCreateInput } from './EnvironmentCreateInput';

@ArgsType()
export class CreateEnvironmentArgs {
  @Field(() => EnvironmentCreateInput, { nullable: false })
  data!: EnvironmentCreateInput;
}
