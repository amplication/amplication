import { ArgsType, Field } from "@nestjs/graphql";
import { UpdateBlockArgs } from "../../block/dto/UpdateBlockArgs";
import { PrivatePluginUpdateInput } from "./PrivatePluginUpdateInput";

@ArgsType()
export class UpdatePrivatePluginArgs extends UpdateBlockArgs {
  @Field(() => PrivatePluginUpdateInput, { nullable: false })
  declare data: PrivatePluginUpdateInput;
}
