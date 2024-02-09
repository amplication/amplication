import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class SignupWithBusinessEmailInput {
  @Field(() => String, { nullable: false })
  email!: string;
}
