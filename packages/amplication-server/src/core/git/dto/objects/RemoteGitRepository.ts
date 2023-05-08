import { ObjectType, Field } from "@nestjs/graphql";
import { Pagination } from "./Pagination";

@ObjectType({
  isAbstract: true,
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

  @Field(() => String, {
    nullable: true,
  })
  groupName?: string | null;
}

@ObjectType({
  isAbstract: true,
})
export class RemoteGitRepos {
  @Field(() => [RemoteGitRepository])
  repos: RemoteGitRepository[];

  @Field(() => Number)
  total: number | null;

  @Field(() => Pagination)
  pagination: Pagination;
}
