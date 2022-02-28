import { ArgsType, Field } from '@nestjs/graphql';
import { RepoCreateInput } from '../inputs/CreateRepo';

@ArgsType()
export class CreateRepoArgs {
  @Field(() => RepoCreateInput, { nullable: false })
  input: RepoCreateInput;

}
