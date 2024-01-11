import { WhereUniqueInput } from "../../../dto";
import { BlockUpdateInput } from "./BlockUpdateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class UpdateBlockArgs {
  @Field(() => BlockUpdateInput, { nullable: false })
  data!: BlockUpdateInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
