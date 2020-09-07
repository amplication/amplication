import { Field, InputType } from '@nestjs/graphql';
import { SortOrder } from 'src/enums/SortOrder';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EntityVersionOrderByInput {
  @Field(() => SortOrder, {
    nullable: true,
    description: undefined
  })
  id?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
    description: undefined
  })
  createdAt?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
    description: undefined
  })
  updatedAt?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
    description: undefined
  })
  versionNumber?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
    description: undefined
  })
  name?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
    description: undefined
  })
  displayName?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
    description: undefined
  })
  pluralDisplayName?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
    description: undefined
  })
  description?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
    description: undefined
  })
  label?: SortOrder | null;
}
