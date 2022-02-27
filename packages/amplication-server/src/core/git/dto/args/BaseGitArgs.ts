import { ArgsType, Field } from '@nestjs/graphql';
import { EnumGitProvider } from '../enums/EnumGitProvider';

@ArgsType()
export class BaseGitArgs {
  @Field(() => String, { nullable: false })
  gitOrganizationId;
  @Field(() => String, { nullable: true })
  workspaceId?;
  @Field(() => EnumGitProvider, { nullable: false })
  sourceControlService;
}
