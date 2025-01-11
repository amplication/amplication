import { Field, InputType } from "@nestjs/graphql";

@InputType({ isAbstract: true })
export class RoleUpdateInput {
  @Field(() => String, { nullable: true })
  name?: string | undefined;

  @Field(() => String, { nullable: true })
  description?: string | undefined;

  @Field(() => String, { nullable: true })
  key?: string | undefined;
}
