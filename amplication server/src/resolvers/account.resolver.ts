import { PrismaService } from '../services/prisma.service';
import { GqlAuthGuard } from '../guards/gql-auth.guard';
import {
  Resolver,
  Query,
  ResolveProperty,
  Parent,
  Mutation,
  Args
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserEntity } from '../decorators/user.decorator';
import { Account, User } from '../models';
import { ChangePasswordInput, UpdateAccountInput } from '../dto/inputs'
import { AccountService } from 'src/core';
import { Roles } from '../decorators/roles.decorator';

@Resolver(of => Account)
@UseGuards(GqlAuthGuard)
export class AccountResolver {
  constructor(
    private accountService: AccountService
  ) {}

  @Query(returns => User)
  @Roles('ADMIN')
  async me(@UserEntity() user: User): Promise<User> {
    return user;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Account)
  async updateAccount(
    @UserEntity() account: Account,
    @Args('data') newAccountData: UpdateAccountInput
  ) {
    return this.accountService.updateAccount(account.id, newAccountData);
  }

  @UseGuards(GqlAuthGuard)
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
