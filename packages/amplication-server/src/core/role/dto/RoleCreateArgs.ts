import { ArgsType, Field } from "@nestjs/graphql";
import { RoleCreateInput } from "./RoleCreateInput";

@ArgsType()
export class RoleCreateArgs {
  @Field(() => RoleCreateInput, { nullable: false })
  data!: RoleCreateInput;
}
