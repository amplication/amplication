import { CreateGitRepositoryBaseInput } from "../inputs/CreateGitRepositoryBaseInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class CreateGitRepositoryBaseArgs {
  @Field(() => CreateGitRepositoryBaseInput, { nullable: false })
  data!: CreateGitRepositoryBaseInput;
}
