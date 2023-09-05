import { ArgsType, Field } from "@nestjs/graphql";
import { ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { Credentials } from "./Credentials";

@ArgsType()
export class LoginArgs {
  @Field(() => Credentials, { nullable: false })
  @Type(() => Credentials)
  @ValidateNested()
  credentials!: Credentials;
}
