import { Field, InputType } from '@nestjs/graphql';
import { SortOrder } from 'src/enums/SortOrder';

@InputType({
  isAbstract: true,
  description: undefined
})
export class CommitOrderByInput {
  @Field(() => SortOrder, {
    nullable: true
  })
  id?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true
  })
  createdAt?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true
  })
  message?: SortOrder | null;
}
