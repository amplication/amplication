import { ArgsType, Field } from "@nestjs/graphql";
import { WhereUniqueInput } from "../../../../dto";
import { GitRepositoryUpdateInput } from "../inputs/GitRepositoryUpdateInput";

@ArgsType()
class UpdateGitRepositoryArgs {
  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;

  @Field(() => GitRepositoryUpdateInput, { nullable: false })
  data!: GitRepositoryUpdateInput;
}

export { UpdateGitRepositoryArgs };
