import { ArgsType, Field } from "@nestjs/graphql";
import { WhereUniqueInput } from "../../../dto";
import { ResourceRelationUpdateInput } from "./ResourceRelationUpdateInput";

@ArgsType()
export class UpdateResourceRelationArgs {
  @Field(() => WhereUniqueInput, { nullable: false })
  resource!: WhereUniqueInput;

  @Field(() => ResourceRelationUpdateInput, { nullable: false })
  data!: ResourceRelationUpdateInput;
}
