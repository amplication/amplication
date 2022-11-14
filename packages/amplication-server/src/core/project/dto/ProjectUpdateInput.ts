import { Field, InputType } from "@nestjs/graphql";

@InputType({ isAbstract: true })
export class ProjectUpdateInput {
  @Field(() => String, { nullable: true })
  name?: string | undefined;
}
