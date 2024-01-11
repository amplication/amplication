import { UpdateBlockArgs } from "../../block/dto/UpdateBlockArgs";
import { ModuleUpdateInput } from "./ModuleUpdateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class UpdateModuleArgs extends UpdateBlockArgs {
  @Field(() => ModuleUpdateInput, { nullable: false })
  declare data: ModuleUpdateInput;
}
