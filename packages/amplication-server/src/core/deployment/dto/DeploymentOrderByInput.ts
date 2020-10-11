import { SortOrder } from 'src/enums/SortOrder';
import { InputType, Field } from '@nestjs/graphql';

@InputType({
  isAbstract: true,
  description: undefined
})
export class DeploymentOrderByInput {
  @Field(() => SortOrder, {
    nullable: true,
    description: undefined
  })
  id?: SortOrder | null | undefined;

  @Field(() => SortOrder, {
    nullable: true,
    description: undefined
  })
  createdAt?: SortOrder | null | undefined;

  @Field(() => SortOrder, {
    nullable: true,
    description: undefined
  })
  userId?: SortOrder | null | undefined;

  @Field(() => SortOrder, {
    nullable: true,
    description: undefined
  })
  status?: SortOrder | null | undefined;

  @Field(() => SortOrder, {
    nullable: true,
    description: undefined
  })
  message?: SortOrder | null | undefined;
}
