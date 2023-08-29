import { Field, InputType } from "@nestjs/graphql";
import { SortOrder } from "../../../enums/SortOrder";

@InputType({
  isAbstract: true,
})
export class BlockOrderByInput {
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
  blockType?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
  })
  displayName?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
  })
  description?: SortOrder | null;
}
