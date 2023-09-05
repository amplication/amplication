import { ArgsType, Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
@ArgsType()
export class ConnectGitRepositoryInput {
  @Field(() => String, { nullable: false })
  name!: string;

  @Field(() => String, {
    nullable: true,
    description:
      "Name of the git provider repository group. It is mandatory when GitOrganisation.useGroupingForRepositories is true",
  })
  groupName?: string;

  @Field(() => String, { nullable: false })
  resourceId!: string;

  @Field(() => String, { nullable: false })
  gitOrganizationId!: string;

  @Field(() => Boolean, { nullable: true })
  isOverrideGitRepository?: boolean;
}
