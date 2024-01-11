import { CreateGitRepositoryBaseInput } from "./CreateGitRepositoryBaseInput";
import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class CreateGitRepositoryInput extends CreateGitRepositoryBaseInput {
  @Field(() => String, {
    nullable: true,
  })
  resourceId?: string;
}
