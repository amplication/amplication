import { Field, InputType } from '@nestjs/graphql';
import { EnumSourceControlService } from '../enums/EnumSourceControlService';

@InputType({
  isAbstract: true
})
export class GitOrganizationCreateInput {
  @Field(() => String, {
    nullable: false
  })
  installationId!: string;

  @Field(() => String, { nullable: false })
  workspaceId!: string;

  @Field(() => EnumSourceControlService, { nullable: false })
  provider!: EnumSourceControlService;
}
