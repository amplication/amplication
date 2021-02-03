import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType({
  isAbstract: true,
  description: undefined
})
export class GithubRepo {
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
}
