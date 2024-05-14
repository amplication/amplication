import { ArgsType, Field } from "@nestjs/graphql";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import { SignupWithBusinessEmailInput } from "./SignupWithBusinessEmailInput";

@ArgsType()
export class SignupWithBusinessEmailArgs {
  @ValidateNested()
  @Type(() => SignupWithBusinessEmailInput)
  @Field(() => SignupWithBusinessEmailInput, { nullable: false })
  data!: SignupWithBusinessEmailInput;
}
