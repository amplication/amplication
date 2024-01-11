import { EnumGitOrganizationType } from "../enums/EnumGitOrganizationType";
import { ObjectType, Field } from "@nestjs/graphql";

@ObjectType({
  isAbstract: true,
})
export class RemoteGitOrganization {
  @Field(() => String)
  name: string;

  @Field(() => EnumGitOrganizationType)
  type: EnumGitOrganizationType;
}
