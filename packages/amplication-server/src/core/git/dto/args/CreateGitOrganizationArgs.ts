import { ArgsType, Field } from '@nestjs/graphql';
import { GitOrganizationCreateInput } from '../inputs/GitOrganizationCreateInput';
import { BaseGitArgs } from './BaseGitArgs';

@ArgsType()
export class CreateGitOrganizationArgs extends BaseGitArgs {
  @Field(() => GitOrganizationCreateInput, { nullable: false })
  data!: GitOrganizationCreateInput;
}
