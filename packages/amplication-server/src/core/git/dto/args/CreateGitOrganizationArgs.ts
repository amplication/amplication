import { GitOrganizationCreateInput } from "../inputs/GitOrganizationCreateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class CreateGitOrganizationArgs {
  @Field(() => GitOrganizationCreateInput, { nullable: false })
  data!: GitOrganizationCreateInput;
}
