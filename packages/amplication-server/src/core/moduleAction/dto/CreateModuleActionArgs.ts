import { ModuleActionCreateInput } from "./ModuleActionCreateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class CreateModuleActionArgs {
  @Field(() => ModuleActionCreateInput, { nullable: false })
  data!: ModuleActionCreateInput;
}
