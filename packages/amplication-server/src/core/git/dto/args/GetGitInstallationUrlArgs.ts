import { GitGetInstallationUrlInput } from "../inputs/GitGetInstallationUrlInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class GetGitInstallationUrlArgs {
  @Field(() => GitGetInstallationUrlInput, { nullable: false })
  data!: GitGetInstallationUrlInput;
}
