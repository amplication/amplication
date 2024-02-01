import { ArgsType, Field } from "@nestjs/graphql";
import { ModuleCreateInput } from "./ModuleCreateInput";

@ArgsType()
export class CreateModuleArgs {
  @Field(() => ModuleCreateInput, { nullable: false })
  data!: ModuleCreateInput;
}
