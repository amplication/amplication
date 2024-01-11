import { LoginInput } from "./login.input";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class LoginArgs {
  @Field(() => LoginInput, { nullable: false })
  data!: LoginInput;
}
