import { ArgsType, Field } from "@nestjs/graphql";
import { BlueprintCreateInput } from "./BlueprintCreateInput";

@ArgsType()
export class BlueprintCreateArgs {
  @Field(() => BlueprintCreateInput, { nullable: false })
  data!: BlueprintCreateInput;
}
