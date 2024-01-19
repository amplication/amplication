import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class AuthPreviewAccount {
  @Field(() => String, { nullable: true })
  token?: string;

  @Field(() => String, { nullable: true })
  workspaceId?: string;

  @Field(() => String, { nullable: true })
  projectId?: string;

  @Field(() => String, { nullable: true })
  resourceId?: string;

  @Field(() => String, { nullable: true })
  message?: string;
}
