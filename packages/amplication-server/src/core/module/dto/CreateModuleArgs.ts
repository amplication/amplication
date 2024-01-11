import { ModuleCreateInput } from "./ModuleCreateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class CreateModuleArgs {
  @Field(() => ModuleCreateInput, { nullable: false })
  data!: ModuleCreateInput;
}
