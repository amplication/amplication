import { ArgsType, Field } from "@nestjs/graphql";
import { EnumTimeGroup } from "./EnumTimeGroup";

@ArgsType()
export class BaseUsageInsightsArgs {
  @Field(() => Date, { nullable: false })
  startDate!: Date;

  @Field(() => Date, { nullable: false })
  endDate!: Date;

  @Field(() => [String], { nullable: false })
  projectIds!: string[];

  @Field(() => EnumTimeGroup, {
    nullable: true,
    defaultValue: EnumTimeGroup.Month,
  })
  timeGroup?: EnumTimeGroup;
}
