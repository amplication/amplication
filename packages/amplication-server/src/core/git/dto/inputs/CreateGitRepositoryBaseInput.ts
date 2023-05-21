import { Field, InputType } from "@nestjs/graphql";
import { EnumGitOrganizationType } from "../enums/EnumGitOrganizationType";
import { EnumGitProvider } from "../enums/EnumGitProvider";

@InputType({
  isAbstract: true,
})
export class CreateGitRepositoryBaseInput {
  @Field(() => String, {
    nullable: false,
  })
  name!: string;
  @Field(() => String, {
    nullable: true,
    description:
      "Name of the git provider repository group. It is mandatory when GitOrganisation.useGroupingForRepositories is true",
  })
  groupName?: string;

  @Field(() => Boolean, {
    nullable: false,
  })
  isPublic!: boolean;

  @Field(() => String, {
    nullable: false,
  })
  gitOrganizationId!: string;

  @Field(() => EnumGitProvider, {
    nullable: false,
  })
  gitProvider!: EnumGitProvider;

  @Field(() => EnumGitOrganizationType, {
    nullable: false,
  })
  gitOrganizationType!: EnumGitOrganizationType;
}
