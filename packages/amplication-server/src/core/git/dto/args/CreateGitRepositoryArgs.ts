import { ArgsType, Field } from "@nestjs/graphql";
import { CreateGitRepositoryInput } from "../inputs/CreateGitRepositoryInput";

@ArgsType()
export class CreateGitRepositoryArgs {
  @Field(() => CreateGitRepositoryInput, { nullable: false })
  data!: CreateGitRepositoryInput;
}
