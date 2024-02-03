import { ArgsType, Field } from "@nestjs/graphql";
import { UpdateBlockArgs } from "../../block/dto/UpdateBlockArgs";
import { ModuleActionUpdateInput } from "./ModuleActionUpdateInput";

@ArgsType()
export class UpdateModuleActionArgs extends UpdateBlockArgs {
  @Field(() => ModuleActionUpdateInput, { nullable: false })
  declare data: ModuleActionUpdateInput;
}
