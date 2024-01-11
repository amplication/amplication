import { SignupInput } from "./signup.input";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class SignupArgs {
  @Field(() => SignupInput, { nullable: false })
  data!: SignupInput;
}
