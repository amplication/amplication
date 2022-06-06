import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthorizeAppWithGitResult {
  @Field({ description: '', nullable: false })
  url: string;
}
