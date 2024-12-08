import { ArgsType, Field } from "@nestjs/graphql";
import { UpdateBlockArgs } from "../../block/dto/UpdateBlockArgs";
import { ResourceSettingsUpdateInput } from "./ResourceSettingsUpdateInput";

@ArgsType()
export class UpdateResourceSettingsArgs extends UpdateBlockArgs {
  @Field(() => ResourceSettingsUpdateInput, { nullable: false })
  declare data: ResourceSettingsUpdateInput;
}
