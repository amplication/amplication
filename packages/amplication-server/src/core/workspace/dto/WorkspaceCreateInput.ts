import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class WorkspaceCreateInput {
  @Field(() => String, {
    nullable: false,
  })
  name!: string;
}
