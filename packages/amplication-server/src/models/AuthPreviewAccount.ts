import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class AuthPreviewAccount {
  @Field({ nullable: true })
  token?: string;

  @Field({ nullable: true })
  workspaceId?: string;

  @Field({ nullable: true })
  projectId?: string;

  @Field({ nullable: true })
  resourceId?: string;

  @Field({ nullable: true })
  message?: string;
}
