import { ArgsType } from "@nestjs/graphql";
import { Credentials } from "./Credentials";

@ArgsType()
export class LoginArgs {
  credentials!: Credentials;
}
