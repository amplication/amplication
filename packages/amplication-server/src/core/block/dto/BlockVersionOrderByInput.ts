import { Field, InputType } from "@nestjs/graphql";
import { SortOrder } from "../../../enums/SortOrder";

@InputType({
  isAbstract: true,
})
export class BlockVersionOrderByInput {
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
  versionNumber?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
  })
  label?: SortOrder | null;
}
