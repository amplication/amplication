import { CreateGitRepositoryInput } from "../inputs/CreateGitRepositoryInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class CreateGitRepositoryArgs {
  @Field(() => CreateGitRepositoryInput, { nullable: false })
  data!: CreateGitRepositoryInput;
}
