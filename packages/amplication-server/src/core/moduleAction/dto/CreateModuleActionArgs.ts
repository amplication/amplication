import { ArgsType, Field } from "@nestjs/graphql";
import { ModuleActionCreateInput } from "./ModuleActionCreateInput";

@ArgsType()
export class CreateModuleActionArgs {
  @Field(() => ModuleActionCreateInput, { nullable: false })
  data!: ModuleActionCreateInput;
}
