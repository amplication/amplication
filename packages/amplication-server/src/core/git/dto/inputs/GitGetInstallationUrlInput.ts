import { Field, InputType } from '@nestjs/graphql';
import { EnumSourceControlService } from '../enums/EnumSourceControlService';

@InputType({
  isAbstract: true
})
export class GitGetInstallationUrlInput {
  @Field(() => String, {
    nullable: false
  })
  workspaceId!: string;

  @Field(() => EnumSourceControlService, { nullable: false })
sourceControlService!: EnumSourceControlService;

}

