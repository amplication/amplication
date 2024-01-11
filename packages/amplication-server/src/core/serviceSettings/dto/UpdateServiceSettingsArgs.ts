import { UpdateBlockArgs } from "../../block/dto/UpdateBlockArgs";
import { ServiceSettingsUpdateInput } from "./ServiceSettingsUpdateInput";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class UpdateServiceSettingsArgs extends UpdateBlockArgs {
  @Field(() => ServiceSettingsUpdateInput, { nullable: false })
  declare data: ServiceSettingsUpdateInput;
}
