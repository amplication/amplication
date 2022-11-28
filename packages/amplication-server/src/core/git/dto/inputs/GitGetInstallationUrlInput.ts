import { Field, InputType } from "@nestjs/graphql";
import { EnumGitProvider } from "../enums/EnumGitProvider";

@InputType({
  isAbstract: true,
})
export class GitGetInstallationUrlInput {
  workspaceId!: string;

  @Field(() => EnumGitProvider, { nullable: false })
  gitProvider!: EnumGitProvider;
}
