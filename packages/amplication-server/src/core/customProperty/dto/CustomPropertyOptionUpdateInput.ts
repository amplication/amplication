import { Field, InputType } from "@nestjs/graphql";

@InputType({
  isAbstract: true,
})
export class CustomPropertyOptionUpdateInput {
  @Field(() => String, {
    nullable: false,
  })
  value!: string;

  @Field(() => String, {
    nullable: false,
  })
  color!: string;
}
