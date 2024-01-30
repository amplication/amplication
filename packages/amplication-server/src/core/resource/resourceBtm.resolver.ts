import { UseFilters, UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import { Resource, User } from "../../models";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { UserEntity } from "../../decorators/user.decorator";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { UserAction } from "../userAction/dto";
import { ResourceBtmService } from "./resourceBtm.service";
import { BreakServiceToMicroservicesResult } from "./dto/BreakServiceToMicroservicesResult";

@Resolver(() => Resource)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class ResourceBtmResolver {
  constructor(private readonly resourceBtmService: ResourceBtmService) {}

  @Mutation(() => UserAction, {
    nullable: true,
    description:
      "Trigger the generation of a set of recommendations for breaking a resource into microservices",
  })
  @AuthorizeContext(AuthorizableOriginParameter.ResourceId, "resourceId")
  async triggerBreakServiceIntoMicroservices(
    @Args({ name: "resourceId", type: () => String })
    resourceId: string,
    @UserEntity() user: User
  ): Promise<UserAction> {
    return this.resourceBtmService.triggerBreakServiceIntoMicroservices({
      resourceId,
      userId: user.id,
    });
  }

  @Query(() => BreakServiceToMicroservicesResult, {
    description:
      "Get the changes to apply to the model in order to break a resource into microservices",
  })
  @AuthorizeContext(AuthorizableOriginParameter.UserActionId, "userActionId")
  async finalizeBreakServiceIntoMicroservices(
    @Args({ name: "userActionId", type: () => String })
    userActionId: string
  ): Promise<BreakServiceToMicroservicesResult> {
    return this.resourceBtmService.finalizeBreakServiceIntoMicroservices(
      userActionId
    );
  }
}
