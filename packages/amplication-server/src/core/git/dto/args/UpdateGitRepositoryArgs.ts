import { WhereUniqueInput } from "../../../../dto";
import { GitRepositoryUpdateInput } from "../inputs/GitRepositoryUpdateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
class UpdateGitRepositoryArgs {
  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;

  @Field(() => GitRepositoryUpdateInput, { nullable: false })
  data!: GitRepositoryUpdateInput;
}

export { UpdateGitRepositoryArgs };
