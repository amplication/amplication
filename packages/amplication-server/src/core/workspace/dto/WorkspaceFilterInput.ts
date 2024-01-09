import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class WorkspaceFilterInput {
  @Field(() => String, {
    nullable: true,
  })
  workspaceId?: string | null;

  @Field(() => String, {
    nullable: true,
  })
  projectId?: string | null;

  @Field(() => String, {
    nullable: true,
  })
  resourceId?: string | null;
}
