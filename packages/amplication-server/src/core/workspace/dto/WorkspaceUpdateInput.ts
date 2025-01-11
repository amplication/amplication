import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class WorkspaceUpdateInput {
  @Field(() => String, {
    nullable: true,
  })
  name?: string | null;

  @Field(() => Boolean, {
    nullable: true,
  })
  allowLLMFeatures?: boolean;
}
