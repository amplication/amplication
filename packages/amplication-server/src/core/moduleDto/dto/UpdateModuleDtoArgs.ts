import { ArgsType, Field } from "@nestjs/graphql";
import { UpdateBlockArgs } from "../../block/dto/UpdateBlockArgs";
import { ModuleDtoUpdateInput } from "./ModuleDtoUpdateInput";

@ArgsType()
export class UpdateModuleDtoArgs extends UpdateBlockArgs {
  @Field(() => ModuleDtoUpdateInput, { nullable: false })
  declare data: ModuleDtoUpdateInput;
}
