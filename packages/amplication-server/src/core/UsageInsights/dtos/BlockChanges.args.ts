import { EnumBlockType } from "../../../enums/EnumBlockType";
import { BaseUsageInsightsArgs } from "./BaseUsageInsightsArgs.args";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class BlockChangesArgs extends BaseUsageInsightsArgs {
  @Field(() => EnumBlockType, { nullable: false })
  blockType!: keyof typeof EnumBlockType;
}
