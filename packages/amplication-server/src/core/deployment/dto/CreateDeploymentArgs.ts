import { ArgsType, Field } from '@nestjs/graphql';
import { DeploymentCreateInput } from './DeploymentCreateInput';

@ArgsType()
export class CreateDeploymentArgs {
  @Field(() => DeploymentCreateInput, { nullable: false })
  data!: DeploymentCreateInput;
}
