import { SortOrder } from 'src/enums/SortOrder';
import { InputType, Field } from '@nestjs/graphql';

@InputType({
  isAbstract: true
})
export class BuildOrderByInput {
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
  userId?: SortOrder | null | undefined;

  @Field(() => SortOrder, {
    nullable: true
  })
  status?: SortOrder | null | undefined;

  @Field(() => SortOrder, {
    nullable: true
  })
  version?: SortOrder | null | undefined;

  @Field(() => SortOrder, {
    nullable: true
  })
  message?: SortOrder | null | undefined;
}
