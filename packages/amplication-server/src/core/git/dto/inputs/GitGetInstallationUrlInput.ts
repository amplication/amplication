import { EnumGitProvider } from "../enums/EnumGitProvider";
import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class GitGetInstallationUrlInput {
  workspaceId!: string;

  @Field(() => EnumGitProvider, { nullable: false })
  gitProvider!: EnumGitProvider;
}
