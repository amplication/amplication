import { RemoteGitRepositoriesWhereUniqueInput } from "../inputs/RemoteGitRepositoriesWhereUniqueInput";
import { ArgsType, Field } from "@nestjs/graphql";
@ArgsType()
export class RemoteGitRepositoriesFindManyArgs {
  @Field(() => RemoteGitRepositoriesWhereUniqueInput, { nullable: false })
  where: RemoteGitRepositoriesWhereUniqueInput;
}
