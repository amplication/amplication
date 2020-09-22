import { Field, InputType } from '@nestjs/graphql';
import { SortOrder } from 'src/enums/SortOrder';

@InputType({
  isAbstract: true,
  description: undefined
})
export class EntityFieldOrderByInput {
  @Field(() => SortOrder, {
    nullable: true,
    description: undefined
  })
  id?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
    description: undefined
  })
  permanentId?: SortOrder | null;

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
  dataType?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
    description: undefined
  })
  required?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
    description: undefined
  })
  searchable?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
    description: undefined
  })
  description?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
    description: undefined
  })
  position?: SortOrder | null;
}
