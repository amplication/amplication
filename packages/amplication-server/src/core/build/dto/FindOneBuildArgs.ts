import { WhereUniqueInput } from "../../../dto";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class FindOneBuildArgs {
  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
