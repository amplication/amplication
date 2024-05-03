import { ArgsType, Field } from "@nestjs/graphql";
import { ConnectGitRepositoryInput } from "../inputs/ConnectGitRepositoryInput";

@ArgsType()
export class ConnectGitRepositoryArgs {
  @Field(() => ConnectGitRepositoryInput, { nullable: false })
  data!: ConnectGitRepositoryInput;
}
