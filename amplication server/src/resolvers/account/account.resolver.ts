import { PrismaService } from '../../services/prisma.service';
import { GqlAuthGuard } from '../../guards/gql-auth.guard';
import {
  Resolver,
  Query,
  ResolveProperty,
  Parent,
  Mutation,
  Args
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserEntity } from '../../decorators/user.decorator';
import { Account } from '../../models';
import { ChangePasswordInput } from './dto/change-password.input';
import { AccountService } from 'src/core';
import { UpdateAccountInput } from './dto/update-account.input';

@Resolver(of => Account)
@UseGuards(GqlAuthGuard)
export class AccountResolver {
  constructor(
    private accountService: AccountService,
    private prisma: PrismaService
  ) {}

  @Query(returns => Account)
  async me(@UserEntity() account: Account): Promise<Account> {
    return account;
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
