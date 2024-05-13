import { Field, InputType } from "@nestjs/graphql";
import { User } from "../../../models";

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
  user: User;
  workspaceId: string;
}
