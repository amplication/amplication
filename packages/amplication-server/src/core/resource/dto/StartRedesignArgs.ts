import { ArgsType, Field } from "@nestjs/graphql";
import { WhereUniqueInput } from "../../../dto";

@ArgsType()
export class StartRedesignArgs {
  @Field(() => WhereUniqueInput, { nullable: false })
  data!: WhereUniqueInput;
}
