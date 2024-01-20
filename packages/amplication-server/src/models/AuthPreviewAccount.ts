import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class AuthPreviewAccount {
  @Field(() => String, { nullable: false })
  token!: string;

  @Field(() => String, { nullable: false })
  workspaceId!: string;

  @Field(() => String, { nullable: false })
  projectId!: string;

  @Field(() => String, { nullable: false })
  resourceId!: string;
}
