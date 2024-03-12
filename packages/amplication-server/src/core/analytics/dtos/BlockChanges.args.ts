import { EnumBlockType } from "../../../enums/EnumBlockType";
import { BaseAnalyticsArgs } from "./BaseAnalytics.args";
import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class BlockChangesArgs extends BaseAnalyticsArgs {
  @Field(() => EnumBlockType, { nullable: false })
  blockType!: keyof typeof EnumBlockType;
}
