import { EntityPermissionFieldWhereUniqueInput } from "./EntityPermissionFieldWhereUniqueInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class DeleteEntityPermissionFieldArgs {
  @Field(() => EntityPermissionFieldWhereUniqueInput, { nullable: false })
  where!: EntityPermissionFieldWhereUniqueInput;
}
