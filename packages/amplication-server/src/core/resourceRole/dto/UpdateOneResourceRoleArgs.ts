import { ArgsType, Field } from "@nestjs/graphql";
import { ResourceRoleUpdateInput } from "./ResourceRoleUpdateInput";
import { WhereUniqueInput } from "../../../dto";

@ArgsType()
export class UpdateOneResourceRoleArgs {
  @Field(() => ResourceRoleUpdateInput, { nullable: false })
  data!: ResourceRoleUpdateInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
