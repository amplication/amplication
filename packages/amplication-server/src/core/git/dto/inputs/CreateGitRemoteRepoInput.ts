import { Field, InputType } from '@nestjs/graphql';
import { EnumGitOrganizationType } from '../enums/EnumGitOrganizationType';

@InputType({
  isAbstract: true
})
export class CreateGitRemoteRepoInput {
  @Field(() => String, {
    nullable: false
  })
  name!: string;
  @Field(() => String, {
    nullable: false
  })
  installationId!: string;

  @Field(() => EnumGitOrganizationType, {
    nullable: false
  })
  gitOrganizationType!: EnumGitOrganizationType;
}
