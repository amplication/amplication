import { InputType, Field } from '@nestjs/graphql';
import { WhereUniqueInput, DateTimeFilter, StringFilter } from 'src/dto';
import { EnumDeploymentStatusFilter } from './EnumDeploymentStatusFilter';

@InputType({
  isAbstract: true
})
export class DeploymentWhereInput {
  @Field(() => StringFilter, {
    nullable: true
  })
  id?: StringFilter | null | undefined;

  @Field(() => DateTimeFilter, {
    nullable: true
  })
  createdAt?: DateTimeFilter | null | undefined;

  @Field(() => WhereUniqueInput)
  build?: WhereUniqueInput;

  @Field(() => WhereUniqueInput)
  environment?: WhereUniqueInput;

  @Field(() => EnumDeploymentStatusFilter, {
    nullable: true
  })
  status?: EnumDeploymentStatusFilter | null | undefined;

  @Field(() => WhereUniqueInput, {
    nullable: true
  })
  createdBy?: WhereUniqueInput | null | undefined;

  @Field(() => StringFilter, {
    nullable: true,
    description: undefined
  })
  message?: StringFilter | null;
}
