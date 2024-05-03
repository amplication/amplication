import { ArgsType, Field } from "@nestjs/graphql";
import { CreateGitRepositoryBaseInput } from "../inputs/CreateGitRepositoryBaseInput";

@ArgsType()
export class CreateGitRepositoryBaseArgs {
  @Field(() => CreateGitRepositoryBaseInput, { nullable: false })
  data!: CreateGitRepositoryBaseInput;
}
