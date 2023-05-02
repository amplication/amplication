import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({
  isAbstract: true,
  description: "Group of Repositories",
})
class GitGroup {
  @Field(() => String, { nullable: false })
  id: string;

  @Field(() => String, { nullable: false })
  displayName: string;

  @Field(() => String, { nullable: false })
  name: string;
}

@ObjectType({
  isAbstract: true,
  description:
    "Returns a paginated list of repository groups available to select.",
})
export class PaginatedGitGroup {
  @Field(() => Number, {
    nullable: false,
    description: "Total number of groups",
  })
  total: number;

  @Field(() => Number, { nullable: false, description: "Page number" })
  page: number;

  @Field(() => Number, {
    nullable: false,
    description: "Number of groups per page",
  })
  pageSize: number;

  @Field(() => [GitGroup], { nullable: true })
  groups: GitGroup[];
}
