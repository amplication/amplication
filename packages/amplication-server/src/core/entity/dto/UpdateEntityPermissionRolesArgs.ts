import { EntityUpdatePermissionRolesInput } from "./EntityUpdatePermissionRolesInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class UpdateEntityPermissionRolesArgs {
  @Field(() => EntityUpdatePermissionRolesInput, { nullable: false })
  data!: EntityUpdatePermissionRolesInput;
}
