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

  @Field(() => String)
  private: string | null;

  @Field(() => String)
  fullName: string | null;

  @Field(() => String)
  admin: boolean | null;
}
