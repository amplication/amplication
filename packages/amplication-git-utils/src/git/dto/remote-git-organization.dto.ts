import { Field, ObjectType } from "@nestjs/graphql";
import { EnumGitOrganizationType } from "../git.types";

@ObjectType({
  isAbstract: true,
  description: undefined,
})
export class RemoteGitOrganization {
  @Field(() => String)
  name: string;

  @Field(() => EnumGitOrganizationType)
  type: EnumGitOrganizationType;
}
