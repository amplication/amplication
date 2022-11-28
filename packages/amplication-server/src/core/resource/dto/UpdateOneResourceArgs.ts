import { ArgsType, Field } from "@nestjs/graphql";
import { ResourceUpdateInput } from "./ResourceUpdateInput";
import { WhereUniqueInput } from "../../../dto";

@ArgsType()
export class UpdateOneResourceArgs {
  @Field(() => ResourceUpdateInput, { nullable: false })
  data!: ResourceUpdateInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
