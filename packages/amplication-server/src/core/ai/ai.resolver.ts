import { UserEntity } from "../../decorators/user.decorator";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { Resource, User } from "../../models";
import { AiService } from "./ai.service";
import { UseFilters, UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { AiRecommendations, TriggerAiRecommendations } from "./dto";
import { AiRecommendationsArgs } from "./dto/ai-recommendation-args.dto";

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
  @AuthorizeContext(AuthorizableOriginParameter.ResourceId, "resourceId")
  async triggerGenerationBtmResourceRecommendation(
    @Args({ name: "resourceId", type: () => String })
    resourceId: string,
    @UserEntity() user: User
  ): Promise<void> {
    await this.aiService.triggerGenerationBtmResourceRecommendation({
      resourceId,
      userId: user.id,
    });
  }

  @Query(() => AiRecommendations, {
    description:
      "Get the changes to apply to the model in order to break a resource into microservices",
  })
  @AuthorizeContext(AuthorizableOriginParameter.ResourceId, "data.resourceId")
  async aiRecommendations(
    @Args()
    args: AiRecommendationsArgs
  ): Promise<AiRecommendations> {
    return this.aiService.btmRecommendationModelChanges(args.data);
  }
}
