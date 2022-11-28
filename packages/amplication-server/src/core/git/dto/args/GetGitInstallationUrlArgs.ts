import { ArgsType, Field } from "@nestjs/graphql";
import { GitGetInstallationUrlInput } from "../inputs/GitGetInstallationUrlInput";

@ArgsType()
export class GetGitInstallationUrlArgs {
  @Field(() => GitGetInstallationUrlInput, { nullable: false })
  data!: GitGetInstallationUrlInput;
}
