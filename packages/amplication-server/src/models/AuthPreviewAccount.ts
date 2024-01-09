import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class AuthPreviewAccount {
  @Field({ nullable: false })
  token?: string;

  @Field({ nullable: false })
  workspaceId?: string;

  @Field({ nullable: false })
  projectId?: string;

  @Field({ nullable: false })
  resourceId?: string;

  @Field({ nullable: false })
  message?: string;
}
