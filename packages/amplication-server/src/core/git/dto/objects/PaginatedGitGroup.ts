import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({
  isAbstract: true,
})
class GitGroup {
  @Field(() => String, { nullable: false })
  id: string;

  @Field(() => String, { nullable: false })
  name: string;

  @Field(() => String, { nullable: false })
  slug: string;
}

@ObjectType({
  isAbstract: true,
})
export class PaginatedGitGroup {
  @Field(() => Number, { nullable: false })
  size: number;

  @Field(() => Number, { nullable: false })
  page: number;

  @Field(() => Number, { nullable: false })
  pagelen: number;

  @Field(() => String, { nullable: true })
  next: string;

  @Field(() => String, { nullable: true })
  previous: string;

  @Field(() => [GitGroup], { nullable: true })
  groups: GitGroup[];
}
