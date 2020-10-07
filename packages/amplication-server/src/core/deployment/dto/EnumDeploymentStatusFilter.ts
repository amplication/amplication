import { InputType, Field } from '@nestjs/graphql';
import { EnumDeploymentStatus } from './EnumDeploymentStatus';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EnumDeploymentStatusFilter {
  @Field(() => EnumDeploymentStatus, {
    nullable: true,
    description: undefined
  })
  equals?: keyof typeof EnumDeploymentStatus | null | undefined;

  @Field(() => EnumDeploymentStatus, {
    nullable: true,
    description: undefined
  })
  not?: keyof typeof EnumDeploymentStatus | null | undefined;

  @Field(() => [EnumDeploymentStatus], {
    nullable: true,
    description: undefined
  })
  in?: Array<keyof typeof EnumDeploymentStatus> | null | undefined;

  @Field(() => [EnumDeploymentStatus], {
    nullable: true,
    description: undefined
  })
  notIn?: Array<keyof typeof EnumDeploymentStatus> | null | undefined;
}
