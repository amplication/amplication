import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { Resource } from "../../models";
import { AiService } from "./ai.service";
import { UseFilters, UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";

@Resolver(() => Resource)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class AiResolver {
  constructor(private readonly aiService: AiService) {}

  @Mutation(() => String, {
    nullable: true,
    description:
      "Trigger the generation of a set of recommendations for breaking a resource into microservices",
  })
  async triggerGenerationBtmResourceRecommendation(
    @Args({ name: "resourceId", type: () => String })
    resourceId: string
  ): Promise<string> {
    return await this.aiService.triggerGenerationBtmResourceRecommendation(
      resourceId
    );
  }
}
