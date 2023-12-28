import { ArgsType, Field } from "@nestjs/graphql";
import { SignupPreviewAccountInput } from "./SignupPreviewAccountInput";

@ArgsType()
export class SignupPreviewAccountArgs {
  @Field(() => SignupPreviewAccountInput, { nullable: false })
  data!: SignupPreviewAccountInput;
}
