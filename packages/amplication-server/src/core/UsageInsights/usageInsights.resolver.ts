import { Args, Query, Resolver } from "@nestjs/graphql";
import { UseFilters, UseGuards } from "@nestjs/common";
import { UsageInsightsService } from "./usageInsights.service";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { BaseUsageInsightsArgs } from "./dtos/BaseUsageInsightsArgs.args";
import {
  UsageInsightsResult,
  EvaluationInsights,
} from "./dtos/UsageInsights.object";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";

@Resolver()
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class UsageInsightsResolver {
  constructor(private readonly analyticsService: UsageInsightsService) {}

  @Query(() => UsageInsightsResult)
  @UseGuards(GqlAuthGuard)
  async getUsageInsights(
    @Args() args: BaseUsageInsightsArgs
  ): Promise<UsageInsightsResult> {
    return this.analyticsService.getUsageInsights(args);
  }

  @Query(() => EvaluationInsights)
  @UseGuards(GqlAuthGuard)
  async getEvaluationInsights(
    @Args() args: BaseUsageInsightsArgs
  ): Promise<EvaluationInsights> {
    return this.analyticsService.getEvaluationInsights(args);
  }
}
