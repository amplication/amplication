import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class GithubFile {
  @Field(() => String)
  name: string | null;

  @Field(() => String)
  path: string | null;

  @Field(() => String)
  content: string;

  @Field(() => String)
  htmlUrl: string | null;
}
