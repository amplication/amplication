import { EnumGitProvider } from "../types";
import { IsString } from "class-validator";
export class SendPullRequestArgs {
  @IsString()
  amplicationAppId!: string;
  @IsString()
  oldBuildId!: string;
  @IsString()
  newBuildId!: string;
  @IsString()
  installationId!: string;
  @IsString()
  gitProvider!: EnumGitProvider;
  // @Field(() => GitOrganization, { nullable: false })
  // gitOrganization: GitOrganization;
  // gitRepository: GitRepository;
}
