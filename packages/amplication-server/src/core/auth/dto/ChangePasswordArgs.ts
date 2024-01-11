import { ChangePasswordInput } from "./change-password.input";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class ChangePasswordArgs {
  @Field(() => ChangePasswordInput, { nullable: false })
  data!: ChangePasswordInput;
}
