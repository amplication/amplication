import { WhereUniqueInput } from "../../../dto";
import { ResourceRoleUpdateInput } from "./ResourceRoleUpdateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class UpdateOneResourceRoleArgs {
  @Field(() => ResourceRoleUpdateInput, { nullable: false })
  data!: ResourceRoleUpdateInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
