import { SortOrder } from './SortOrder';
import { InputType, Field } from '@nestjs/graphql';

@InputType({
  isAbstract: true,
  description: undefined
})
export class BuildOrderByInput {
  @Field(() => SortOrder, {
    nullable: true,
    description: undefined
  })
  id?: keyof typeof SortOrder | null | undefined;

  @Field(() => SortOrder, {
    nullable: true,
    description: undefined
  })
  createdAt?: keyof typeof SortOrder | null | undefined;

  @Field(() => SortOrder, {
    nullable: true,
    description: undefined
  })
  userId?: keyof typeof SortOrder | null | undefined;

  @Field(() => SortOrder, {
    nullable: true,
    description: undefined
  })
  status?: keyof typeof SortOrder | null | undefined;
}
