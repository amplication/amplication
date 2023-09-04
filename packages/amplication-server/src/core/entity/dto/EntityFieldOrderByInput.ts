import { Field, InputType } from "@nestjs/graphql";
import { SortOrder } from "../../../enums/SortOrder";

@InputType({
  isAbstract: true,
})
export class EntityFieldOrderByInput {
  @Field(() => SortOrder, {
    nullable: true,
  })
  id?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
  })
  permanentId?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
  })
  createdAt?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
  })
  updatedAt?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
  })
  name?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
  })
  displayName?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
  })
  dataType?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
  })
  required?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
  })
  unique?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
  })
  searchable?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
  })
  customAttributes?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
  })
  description?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
  })
  position?: SortOrder | null;
}
