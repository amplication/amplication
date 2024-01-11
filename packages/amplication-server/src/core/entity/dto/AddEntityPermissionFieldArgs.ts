import { EntityAddPermissionFieldInput } from "./EntityAddPermissionFieldInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class AddEntityPermissionFieldArgs {
  @Field(() => EntityAddPermissionFieldInput, { nullable: false })
  data!: EntityAddPermissionFieldInput;
}
