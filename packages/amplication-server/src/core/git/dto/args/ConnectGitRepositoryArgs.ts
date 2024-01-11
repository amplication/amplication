import { ConnectGitRepositoryInput } from "../inputs/ConnectGitRepositoryInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class ConnectGitRepositoryArgs {
  @Field(() => ConnectGitRepositoryInput, { nullable: false })
  data!: ConnectGitRepositoryInput;
}
