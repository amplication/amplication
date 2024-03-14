import { Args, Query, Resolver } from "@nestjs/graphql";
import { UseFilters, UseGuards } from "@nestjs/common";
import { UsageInsightsService } from "./usageInsights.service";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { BaseUsageInsightsArgs } from "./dtos/BaseUsageInsightsArgs.args";
import { AllAnalyticsResults } from "./dtos/UsageInsights.object";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";

@Resolver()
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class UsageInsightsResolver {
  constructor(private readonly analyticsService: UsageInsightsService) {}

  @Query(() => AllAnalyticsResults)
  @UseGuards(GqlAuthGuard)
  async getUsageInsights(
    @Args() args: BaseUsageInsightsArgs
  ): Promise<AllAnalyticsResults> {
    return this.analyticsService.getUsageInsights(args);
  }
}
