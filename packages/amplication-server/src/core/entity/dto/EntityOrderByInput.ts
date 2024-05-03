import { Field, InputType } from "@nestjs/graphql";
import { SortOrder } from "../../../enums/SortOrder";

@InputType({
  isAbstract: true,
})
export class EntityOrderByInput {
  @Field(() => SortOrder, {
    nullable: true,
  })
  id?: SortOrder | null;

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
  pluralDisplayName?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
  })
  customAttributes?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
  })
  description?: SortOrder | null;
}
