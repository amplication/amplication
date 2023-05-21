import { Field, ObjectType } from "@nestjs/graphql";
import type { JsonValue } from "type-fest";
import { EnumGitOrganizationType } from "../core/git/dto/enums/EnumGitOrganizationType";
import { EnumGitProvider } from "../core/git/dto/enums/EnumGitProvider";

@ObjectType({
  isAbstract: true,
})
export class GitOrganization {
  @Field(() => String, { nullable: false })
  id!: string;

  @Field(() => EnumGitProvider, { nullable: false })
  provider!: keyof typeof EnumGitProvider;

  @Field(() => String, { nullable: false })
  name!: string;

  @Field(() => String, { nullable: false })
  installationId!: string;

  @Field(() => Date, { nullable: false })
  createdAt!: Date;

  @Field(() => Date, { nullable: false })
  updatedAt!: Date;

  @Field(() => EnumGitOrganizationType, { nullable: false })
  type!: keyof typeof EnumGitOrganizationType;

  @Field(() => Boolean, {
    nullable: false,
    description:
      "Defines if a git organisation needs defined repository groups",
  })
  useGroupingForRepositories!: boolean;

  // don't use field decorator to avoid exposing properties to the client
  providerProperties!: JsonValue;
}
