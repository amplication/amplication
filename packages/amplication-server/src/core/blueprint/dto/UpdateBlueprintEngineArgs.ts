import { ArgsType, Field } from "@nestjs/graphql";
import { WhereUniqueInput } from "../../../dto";
import { BlueprintUpdateEngineInput } from "./BlueprintUpdateEngineInput";

@ArgsType()
export class UpdateBlueprintEngineArgs {
  @Field(() => BlueprintUpdateEngineInput, { nullable: false })
  data!: BlueprintUpdateEngineInput;

  @Field(() => WhereUniqueInput, { nullable: false })
  where!: WhereUniqueInput;
}
