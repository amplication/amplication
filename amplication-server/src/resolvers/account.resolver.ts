import { GqlAuthGuard } from '../guards/gql-auth.guard';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards, UseFilters } from '@nestjs/common';
import { UserEntity } from '../decorators/user.decorator';
import { Account, User } from '../models';
import { ChangePasswordInput, UpdateAccountInput } from '../dto/inputs';
import { AccountService } from 'src/core';
import { GqlResolverExceptionsFilter } from '../filters/GqlResolverExceptions.filter';

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

  @Mutation(returns => Account)
  async changePassword(
    @UserEntity() account: Account,
    @Args('data') changePassword: ChangePasswordInput
  ) {
    return this.accountService.changePassword(
      account.id,
      account.password,
      changePassword
    );
  }

  // @ResolveProperty('posts')
  // posts(@Parent() author: User) {
  //   return this.prisma.account.findOne({ where: { id: author.id } }).posts();
  // }
}
