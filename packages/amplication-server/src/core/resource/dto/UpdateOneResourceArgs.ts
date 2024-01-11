import { WhereUniqueInput } from "../../../dto";
import { ResourceUpdateInput } from "./ResourceUpdateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class UpdateOneResourceArgs {
  @Field(() => ResourceUpdateInput, { nullable: false })
  data!: ResourceUpdateInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
