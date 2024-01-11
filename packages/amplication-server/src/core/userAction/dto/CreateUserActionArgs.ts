import { UserActionCreateInput } from "./UserActionCreateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class CreateUserActionArgs {
  @Field(() => UserActionCreateInput, { nullable: false })
  data!: UserActionCreateInput;
}
