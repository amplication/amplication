import { ArgsType, Field } from "@nestjs/graphql";
import { GitOrganizationCreateInput } from "../inputs/GitOrganizationCreateInput";

@ArgsType()
export class CreateGitOrganizationArgs {
  @Field(() => GitOrganizationCreateInput, { nullable: false })
  data!: GitOrganizationCreateInput;
}
