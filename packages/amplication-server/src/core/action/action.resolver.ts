import { UseGuards, UseFilters } from '@nestjs/common';
import { Args, Resolver, Query, Parent, ResolveField } from '@nestjs/graphql';
import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { Action } from './dto/Action';
import { ActionStep } from './dto/ActionStep';
import { FindOneActionArgs } from './dto/FindOneActionArgs';
import { ActionService } from './action.service';
import { AuthorizeContext } from 'src/decorators/authorizeContext.decorator';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';

@Resolver(() => Action)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class ActionResolver {
  constructor(private readonly service: ActionService) {}

  @Query(() => Action)
  @AuthorizeContext(AuthorizableResourceParameter.ActionId, 'where.id')
  async action(@Args() args: FindOneActionArgs): Promise<Action> {
    return this.service.findOne(args);
  }

  @ResolveField(() => [ActionStep])
  async steps(@Parent() action: Action) {
    return this.service.getSteps(action.id);
  }
}
