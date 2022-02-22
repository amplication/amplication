import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { EnumSourceControlService } from '../enums/EnumSourceControlService';

@InputType({
    isAbstract: true
  })
@ArgsType()
export class GetGitOrganizationsInput { 
    @Field(() => String, { nullable: false })
    workspaceId!: string;

    @Field(() => EnumSourceControlService, { nullable: false })
    sourceControlService!: EnumSourceControlService;
}
