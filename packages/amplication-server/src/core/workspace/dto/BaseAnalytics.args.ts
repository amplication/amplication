import { ArgsType, Field } from "@nestjs/graphql";

@ArgsType()
export class BaseAnalyticsArgs {
  @Field(() => String, { nullable: false })
  workspaceId!: string;

  @Field(() => Date, { nullable: false })
  startDate!: Date;

  @Field(() => Date, { nullable: false })
  endDate!: Date;

  @Field(() => String, { nullable: true })
  projectId?: string;

  @Field(() => String, { nullable: true })
  resourceId?: string;
}
