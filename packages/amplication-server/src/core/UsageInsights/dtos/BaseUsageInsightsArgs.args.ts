import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class BaseUsageInsightsArgs {
  @Field(() => Date, { nullable: false })
  startDate!: Date;

  @Field(() => Date, { nullable: false })
  endDate!: Date;

  @Field(() => [String], { nullable: false })
  projectIds!: string[];
}
