import { SortOrder } from "../../../enums/SortOrder";
import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class CommitOrderByInput {
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
  message?: SortOrder | null;
}
