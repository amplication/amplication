import { Field, ObjectType } from '@nestjs/graphql';
import { EnumGitOrganizationType } from '../enums/EnumGitOrganizationType';

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class RemoteGitOrganization {
  @Field(() => String)
  name: string;

  @Field(() => EnumGitOrganizationType)
  type: EnumGitOrganizationType;
}
