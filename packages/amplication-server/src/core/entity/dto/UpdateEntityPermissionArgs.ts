import { WhereUniqueInput } from "../../../dto";
import { EntityUpdatePermissionInput } from "./EntityUpdatePermissionInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class UpdateEntityPermissionArgs {
  @Field(() => EntityUpdatePermissionInput, { nullable: false })
  data!: EntityUpdatePermissionInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
