import { ArgsType, Field } from "@nestjs/graphql";
import { Credentials } from "./Credentials";

@ArgsType()
export class LoginArgs {
  @Field(() => Credentials, { nullable: false })
  credentials!: Credentials;
}
