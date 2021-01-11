import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthorizeAppWithGithubResult {
  @Field({ description: '', nullable: false })
  url: string;
}
