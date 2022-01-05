import { ArgsType, Field } from '@nestjs/graphql';
import { EnumSourceControlService } from '../enums/EnumSourceControlService';

@ArgsType()
export class BaseGitArgs {
  @Field(() => String, { nullable: false })
  appId;
  @Field(() => EnumSourceControlService, { nullable: false })
  sourceControlService;
}
