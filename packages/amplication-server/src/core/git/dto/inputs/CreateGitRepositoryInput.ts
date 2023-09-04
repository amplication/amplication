import { Field, InputType } from "@nestjs/graphql";
import { CreateGitRepositoryBaseInput } from "./CreateGitRepositoryBaseInput";

@InputType({
  isAbstract: true,
})
export class CreateGitRepositoryInput extends CreateGitRepositoryBaseInput {
  @Field(() => String, {
    nullable: true,
  })
  resourceId?: string;
}
