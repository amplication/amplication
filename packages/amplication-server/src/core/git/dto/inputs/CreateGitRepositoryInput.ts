import { Field, InputType } from '@nestjs/graphql';
import { EnumGitOrganizationType } from '../enums/EnumGitOrganizationType';
import { EnumGitProvider } from '../enums/EnumGitProvider';

@InputType({
  isAbstract: true
})
export class CreateGitRepositoryInput {
  @Field(() => String, {
    nullable: false
  })
  name!: string;
  @Field(() => Boolean, {
    nullable: false
  })
  public!: boolean;

  @Field(() => String, {
    nullable: false
  })
  resourceId!: string;

  @Field(() => String, {
    nullable: false
  })
  gitOrganizationId!: string;

  @Field(() => EnumGitProvider, {
    nullable: false
  })
  gitProvider!: EnumGitProvider;

  @Field(() => EnumGitOrganizationType, {
    nullable: false
  })
  gitOrganizationType!: EnumGitOrganizationType;
}
