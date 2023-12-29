import { ArgsType, Field } from "@nestjs/graphql";
import { UpdateBlockArgs } from "../../block/dto/UpdateBlockArgs";
import { ModuleDtoPropertyUpdateInput } from "./ModuleDtoPropertyUpdateInput";

@ArgsType()
export class UpdateModuleDtoPropertyArgs extends UpdateBlockArgs {
  @Field(() => ModuleDtoPropertyUpdateInput, { nullable: false })
  declare data: ModuleDtoPropertyUpdateInput;
}
