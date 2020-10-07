import { Field, ArgsType, Int } from '@nestjs/graphql';
import { DeploymentOrderByInput } from './DeploymentOrderByInput';
import { DeploymentWhereInput } from './DeploymentWhereInput';

@ArgsType()
export class FindManyDeploymentArgs {
  @Field(() => DeploymentWhereInput, { nullable: true })
  where?: DeploymentWhereInput | null | undefined;

  @Field(() => DeploymentOrderByInput, { nullable: true })
  orderBy?: DeploymentOrderByInput | null | undefined;

  @Field(() => Int, { nullable: true })
  take?: number | null | undefined;

  @Field(() => Int, { nullable: true })
  skip?: number | null | undefined;
}
