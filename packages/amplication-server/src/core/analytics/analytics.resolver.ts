import { Args, Query, Resolver } from "@nestjs/graphql";
import { UseFilters, UseGuards } from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { BaseAnalyticsArgs } from "./dtos/BaseAnalytics.args";
import { BlockChangesArgs } from "./dtos/BlockChanges.args";
import {
  AllAnalyticsResults,
  AnalyticsResults,
} from "./dtos/AnalyticsResult.object";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { EnumBlockType } from "../../enums/EnumBlockType";

@Resolver()
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class AnalyticsResolver {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Query(() => Number)
  @UseGuards(GqlAuthGuard)
  async getLOCSum(@Args() args: BaseAnalyticsArgs): Promise<number> {
    return this.analyticsService.countLinesOfCode(args);
  }

  @Query(() => AnalyticsResults)
  @UseGuards(GqlAuthGuard)
  async getProjectBuildsCount(
    @Args() args: BaseAnalyticsArgs
  ): Promise<AnalyticsResults> {
    return this.analyticsService.countProjectBuilds(args);
  }

  @Query(() => AnalyticsResults)
  @UseGuards(GqlAuthGuard)
  async getEntityChangesCount(
    @Args() args: BaseAnalyticsArgs
  ): Promise<AnalyticsResults> {
    return this.analyticsService.countEntityChanges(args);
  }

  @Query(() => AnalyticsResults)
  @UseGuards(GqlAuthGuard)
  async getBlockChangesCount(
    @Args() args: BlockChangesArgs
  ): Promise<AnalyticsResults> {
    return this.analyticsService.countBlockChanges({
      ...args,
      blockType: EnumBlockType[args.blockType],
    });
  }

  @Query(() => AllAnalyticsResults)
  @UseGuards(GqlAuthGuard)
  async getAllAnalyticsResults(
    @Args() args: BaseAnalyticsArgs
  ): Promise<AllAnalyticsResults> {
    return this.analyticsService.getAllAnalyticsResults(args);
  }
}
