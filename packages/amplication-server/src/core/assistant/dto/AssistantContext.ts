import { Field, InputType } from "@nestjs/graphql";
import { AuthUser } from "../../auth/types";

@InputType()
export class AssistantContext {
  @Field(() => String, {
    nullable: true,
  })
  projectId?: string;

  @Field(() => String, {
    nullable: true,
  })
  resourceId?: string;

  //the below properties are automatically populated by the resolver based on the authenticated user
  user: AuthUser;
  workspaceId: string;
}
