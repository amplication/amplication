import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class AuthPreviewAccount {
  @Field({ nullable: false })
  cookie: string;

  @Field({ nullable: false })
  workspaceId: string;

  @Field({ nullable: false })
  projectId: string;

  @Field({ nullable: false })
  resourceId: string;
}
