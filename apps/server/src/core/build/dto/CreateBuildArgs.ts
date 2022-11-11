import { ArgsType, Field } from '@nestjs/graphql';
import { BuildCreateInput } from './BuildCreateInput';

@ArgsType()
export class CreateBuildArgs {
  @Field(() => BuildCreateInput, { nullable: false })
  data!: BuildCreateInput;
}
