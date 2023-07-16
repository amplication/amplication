import { ArgsType, Field } from "@nestjs/graphql";
import { UserActionCreateInput } from "./UserActionCreateInput";

@ArgsType()
export class CreateUserActionArgs {
  @Field(() => UserActionCreateInput, { nullable: false })
  data!: UserActionCreateInput;
}
