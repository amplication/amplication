import { ArgsType, Field } from "@nestjs/graphql";
import { ModuleDtoCreateInput } from "./ModuleDtoCreateInput";

@ArgsType()
export class CreateModuleDtoArgs {
  @Field(() => ModuleDtoCreateInput, { nullable: false })
  data!: ModuleDtoCreateInput;
}
