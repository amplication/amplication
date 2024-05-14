import { ArgsType, Field } from "@nestjs/graphql";
import { SignupPreviewAccountInput } from "./SignupPreviewAccountInput";
import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";

@ArgsType()
export class SignupPreviewAccountArgs {
  @ValidateNested()
  @Type(() => SignupPreviewAccountInput)
  @Field(() => SignupPreviewAccountInput, { nullable: false })
  data!: SignupPreviewAccountInput;
}
