import { ArgsType, Field } from "@nestjs/graphql";
import { WhereUniqueInput } from "../../../dto";
import { RoleAddRemovePermissionsInput } from "./RoleAddRemovePermissionsInput";

@ArgsType()
export class RoleAddRemovePermissionsArgs {
  @Field(() => RoleAddRemovePermissionsInput, { nullable: false })
  data!: RoleAddRemovePermissionsInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
