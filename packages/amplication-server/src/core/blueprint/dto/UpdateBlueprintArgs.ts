import { ArgsType, Field } from "@nestjs/graphql";
import { WhereUniqueInput } from "../../../dto";
import { BlueprintUpdateInput } from "./BlueprintUpdateInput";

@ArgsType()
export class UpdateBlueprintArgs {
  @Field(() => BlueprintUpdateInput, { nullable: false })
  data!: BlueprintUpdateInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
