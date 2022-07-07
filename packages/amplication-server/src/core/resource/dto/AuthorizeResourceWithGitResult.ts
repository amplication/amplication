import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthorizeResourceWithGitResult {
  @Field({ description: '', nullable: false })
  url: string;
}
