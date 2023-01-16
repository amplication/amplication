import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType({
  isAbstract: true,
  description: undefined,
})
export class RemoteGitRepository {
  @Field(() => String)
  name: string | null;

  @Field(() => String)
  url: string | null;

  @Field(() => Boolean)
  private: boolean | null;

  @Field(() => String)
  fullName: string | null;

  @Field(() => Boolean)
  admin: boolean | null;

  @Field(() => String)
  defaultBranch: string;
}

@ObjectType({
  isAbstract: true,
  description: undefined,
})
export class RemoteGitRepos {
  @Field(() => [RemoteGitRepository])
  repos: RemoteGitRepository[];

  @Field(() => Number)
  totalRepos: number | null;

  @Field(() => Number)
  currentPage: number | null;

  @Field(() => Number)
  pageSize: number | null;
}
