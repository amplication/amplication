import { Field, InputType } from "@nestjs/graphql";
import { SortOrder } from "../../../../enums/SortOrder";

@InputType({
  isAbstract: true,
})
export class GitOrganizationOrderByInput {
  @Field(() => SortOrder, {
    nullable: true,
  })
  id?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
  })
  provider?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
  })
  name?: SortOrder | null;
}
