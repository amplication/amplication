import { CommitCreateInput } from "./CommitCreateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class CreateCommitArgs {
  @Field(() => CommitCreateInput, { nullable: false })
  data!: CommitCreateInput;
}
