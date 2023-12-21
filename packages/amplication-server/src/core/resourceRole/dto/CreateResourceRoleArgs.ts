import { ArgsType, Field } from "@nestjs/graphql";
import { ResourceRoleCreateInput } from "./ResourceRoleCreateInput";

@ArgsType()
export class CreateResourceRoleArgs {
  @Field(() => ResourceRoleCreateInput, { nullable: false })
  data!: ResourceRoleCreateInput;
}
