import { Field, InputType } from "@nestjs/graphql";

@InputType({ isAbstract: true })
export class TeamUpdateInput {
  @Field(() => String, { nullable: true })
  name?: string | undefined;
}
