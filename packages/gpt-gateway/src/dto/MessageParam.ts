import { Field, InputType } from "@nestjs/graphql";

@InputType()
class MessageParam {
  @Field(() => String, {
    nullable: false,
  })
  name!: string;

  @Field(() => String, {
    nullable: false,
  })
  value!: string;
}

export { MessageParam };
