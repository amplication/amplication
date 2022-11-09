import { ArgsType, Field } from "@nestjs/graphql";
import { WhereUniqueInput } from "../../../dto";

@ArgsType()
export class DeletePluginOrderArgs {
  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
