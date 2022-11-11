import { ObjectType, Field } from '@nestjs/graphql';
import { EnumGitOrganizationType } from '../enums/EnumGitOrganizationType';

@ObjectType({
  isAbstract: true
})
export class RemoteGitOrganization {
  @Field(() => String)
  name: string;

  @Field(() => EnumGitOrganizationType)
  type: EnumGitOrganizationType;
}
