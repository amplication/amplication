import { Field, InputType } from "@nestjs/graphql";

@InputType({ isAbstract: true })
export class TeamUpdateInput {
  @Field(() => String, { nullable: true })
  name?: string | undefined;

  @Field(() => String, { nullable: true })
  description?: string | undefined;

  @Field(() => String, { nullable: true })
  color?: string | undefined;
}
