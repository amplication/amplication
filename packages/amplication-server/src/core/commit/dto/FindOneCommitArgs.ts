import { CommitWhereUniqueInput } from "./CommitWhereUniqueInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class FindOneCommitArgs {
  @Field(() => CommitWhereUniqueInput, { nullable: false })
  where!: CommitWhereUniqueInput;
}
