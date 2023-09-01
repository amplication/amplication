import { ArgsType, Field } from "@nestjs/graphql";
import { WhereUniqueInput } from "../../../dto";
import { BuildUpdateInput } from "./BuildUpdateInput";

@ArgsType()
export class BuildUpdateArgs {
  @Field(() => BuildUpdateInput, { nullable: false })
  data!: BuildUpdateInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
