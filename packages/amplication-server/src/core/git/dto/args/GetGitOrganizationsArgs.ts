import { ArgsType, Field } from '@nestjs/graphql';
import { BaseGitArgs } from './BaseGitArgs';

@ArgsType()
export class GetGitOrganizationsArgs extends BaseGitArgs {
   
    @Field(() => String, { nullable: false })
    workspaceId;
}
