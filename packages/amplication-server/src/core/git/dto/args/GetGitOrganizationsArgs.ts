import { ArgsType, Field } from '@nestjs/graphql';
import { GetGitOrganizationsInput } from '../inputs/GetGitOrganizationsInput';

@ArgsType()
export class GetGitOrganizationsArgs {
  @Field(() => GetGitOrganizationsInput, { nullable: false })
  data!: GetGitOrganizationsInput;
}
