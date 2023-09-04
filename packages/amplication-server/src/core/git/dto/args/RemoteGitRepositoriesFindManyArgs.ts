import { ArgsType, Field } from "@nestjs/graphql";
import { RemoteGitRepositoriesWhereUniqueInput } from "../inputs/RemoteGitRepositoriesWhereUniqueInput";
@ArgsType()
export class RemoteGitRepositoriesFindManyArgs {
  @Field(() => RemoteGitRepositoriesWhereUniqueInput, { nullable: false })
  where: RemoteGitRepositoriesWhereUniqueInput;
}
