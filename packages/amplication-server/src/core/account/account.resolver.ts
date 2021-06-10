import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards, UseFilters } from '@nestjs/common';
import { UserEntity } from 'src/decorators/user.decorator';
import { Account, User, Workspace } from 'src/models';
import { UpdateAccountInput } from './dto/update-account.input';
import { AccountService } from './account.service';
import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';

@Resolver(() => Account)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class AccountResolver {
  constructor(private accountService: AccountService) {}

  @Query(() => Account)
  async account(@UserEntity() user: User): Promise<Account> {
    return user.account;
  }

  @Mutation(() => Account)
  async updateAccount(
    @UserEntity() user: User,
    @Args('data') newAccountData: UpdateAccountInput
  ): Promise<Account> {
    return this.accountService.updateAccount({
      where: { id: user.account.id },
      data: newAccountData
    });
  }

  @Query(() => [Workspace])
  async workspaces(@UserEntity() user: User): Promise<Workspace[]> {
    return this.accountService.getWorkspaces(user.account.id);
  }
}
