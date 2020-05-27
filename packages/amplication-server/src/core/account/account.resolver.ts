import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards, UseFilters } from '@nestjs/common';
import { UserEntity } from 'src/decorators/user.decorator';
import { Account, User } from 'src/models';
import { UpdateAccountInput } from './dto/update-account.input';
import { AccountService } from './account.service';
import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';

@Resolver(of => Account)
@UseGuards(GqlAuthGuard)
@UseFilters(GqlResolverExceptionsFilter)
export class AccountResolver {
  constructor(private accountService: AccountService) {}

  @Query(returns => User)
  async me(@UserEntity() user: User): Promise<User> {
    return user;
  }

  @Mutation(returns => Account)
  async updateAccount(
    @UserEntity() account: Account,
    @Args('data') newAccountData: UpdateAccountInput
  ) {
    return this.accountService.updateAccount(account.id, newAccountData);
  }

  // @ResolveProperty('posts')
  // posts(@Parent() author: User) {
  //   return this.prisma.account.findOne({ where: { id: author.id } }).posts();
  // }
}
