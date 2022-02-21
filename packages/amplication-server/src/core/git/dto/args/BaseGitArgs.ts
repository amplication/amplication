import { ArgsType, Field } from '@nestjs/graphql';
import { EnumSourceControlService } from '../enums/EnumSourceControlService';

@ArgsType()
export class BaseGitArgs {
  @Field(() => String, { nullable: false })
  gitOrganizationId;
  @Field(() => String, { nullable: true })
  workspaceId?;
  @Field(() => EnumSourceControlService, { nullable: false })
  sourceControlService;
}
