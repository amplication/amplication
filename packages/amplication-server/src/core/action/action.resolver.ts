import { UseGuards, UseFilters } from "@nestjs/common";
import { Args, Resolver, Query, Parent, ResolveField } from "@nestjs/graphql";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { Action } from "./dto/Action";
import { ActionStep } from "./dto/ActionStep";
import { FindOneActionArgs } from "./dto/FindOneActionArgs";
import { ActionService } from "./action.service";
import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";

@Resolver(() => Action)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class ActionResolver {
  constructor(private readonly service: ActionService) {}

  @Query(() => Action)
  @AuthorizeContext(AuthorizableOriginParameter.ActionId, "where.id")
  async action(@Args() args: FindOneActionArgs): Promise<Action> {
    return this.service.findOne(args);
  }

  @ResolveField(() => [ActionStep])
  async steps(@Parent() action: Action) {
    //in case the action already has steps, return them instead of fetching from the db
    if (action.steps?.length > 0) return action.steps;
    return this.service.getSteps(action.id);
  }
}
