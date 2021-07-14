import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { InjectContextValue } from 'src/decorators/injectContextValue.decorator';
import { FindSubscriptionsArgs } from './dto/FindSubscriptionsArgs';
import { InjectableResourceParameter } from 'src/enums/InjectableResourceParameter';
import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { Subscription } from './dto/Subscription';
import { SubscriptionService } from './subscription.service';

@Resolver(() => Subscription)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class SubscriptionResolver {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Query(() => [Subscription], {
    nullable: true,
    description: undefined
  })
  @InjectContextValue(
    InjectableResourceParameter.WorkspaceId,
    'where.workspace.id'
  )
  async subscriptions(
    @Args() args: FindSubscriptionsArgs
  ): Promise<Subscription[] | null> {
    return this.subscriptionService.getSubscription(args);
  }
}
