import { Field, InputType } from "@nestjs/graphql";
import { SortOrder } from "../../../../enums/SortOrder";
import { GitOrganizationOrderByInput } from "./GitOrganizationOrderByInput";

@InputType({
  isAbstract: true,
})
export class GitRepositoryOrderByInput {
  @Field(() => SortOrder, {
    nullable: true,
  })
  id?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
  })
  gitOrganizationId?: SortOrder | null;

  @Field(() => GitOrganizationOrderByInput, {
    nullable: true,
  })
  gitOrganization?: GitOrganizationOrderByInput | null;

  @Field(() => SortOrder, {
    nullable: true,
  })
  name?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
  })
  groupName?: SortOrder | null;

  @Field(() => SortOrder, {
    nullable: true,
  })
  baseBranchName?: SortOrder | null;
}
