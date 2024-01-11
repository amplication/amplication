import { ResourceRoleCreateInput } from "./ResourceRoleCreateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class CreateResourceRoleArgs {
  @Field(() => ResourceRoleCreateInput, { nullable: false })
  data!: ResourceRoleCreateInput;
}
