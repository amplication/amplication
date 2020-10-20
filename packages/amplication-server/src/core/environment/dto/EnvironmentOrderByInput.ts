import { SortOrder } from 'src/enums/SortOrder';
import { InputType, Field } from '@nestjs/graphql';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EnvironmentOrderByInput {
  @Field(() => SortOrder, {
    nullable: true
  })
  id?: SortOrder | null | undefined;

  @Field(() => SortOrder, {
    nullable: true
  })
  createdAt?: SortOrder | null | undefined;

  @Field(() => SortOrder, {
    nullable: true
  })
  updated?: SortOrder | null | undefined;

  @Field(() => SortOrder, {
    nullable: true
  })
  name?: SortOrder | null | undefined;

  @Field(() => SortOrder, {
    nullable: true
  })
  description?: SortOrder | null | undefined;

  @Field(() => SortOrder, {
    nullable: true
  })
  address?: SortOrder | null | undefined;
}
