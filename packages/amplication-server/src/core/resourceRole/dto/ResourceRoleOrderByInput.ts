import { Field, InputType } from '@nestjs/graphql';
import { SortOrder } from 'src/enums/SortOrder';

@InputType({
  isAbstract: true
})
export class ResourceRoleOrderByInput {
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
  updatedAt?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true
  })
  name?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true
  })
  displayName?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true
  })
  description?: SortOrder | null;
}
