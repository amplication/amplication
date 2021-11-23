import { Resolver, Parent, ResolveField } from '@nestjs/graphql';
import { User, UserRole, Account } from 'src/models';
import { UserService } from '../';
import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';
import { UseGuards, UseFilters } from '@nestjs/common';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';

@Resolver(() => User)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  // @Query(() => User, {
  //   nullable: true,
  //   description: undefined
  // })
  // async user(@Args() args: FindOneArgs): Promise<User | null> {
  //   return this.userService.findUser(args);
  // }

  // @Query(() => [User], {
  //   nullable: false,
  //   description: undefined
  // })
  // async users(@Args() args: FindManyUserArgs): Promise<User[]> {
  //   return this.userService.findUsers(args);
  // }

  // @Mutation(() => User, {
  //   nullable: true,
  //   description: undefined
  // })
  // async assignRoleToUser(@Args() args: UserRoleArgs): Promise<User | null> {
  //   return this.userService.assignRole(args);
  // }

  // @Mutation(() => User, {
  //   nullable: true,
  //   description: undefined
  // })
  // async removeRoleFromUser(@Args() args: UserRoleArgs): Promise<User | null> {
  //   return this.userService.removeRole(args);
  // }

  @ResolveField(() => [UserRole])
  async userRoles(@Parent() user: User): Promise<UserRole[]> {
    return await this.userService.getRoles(user.id);
  }

  @ResolveField(() => Account)
  async account(@Parent() user: User): Promise<Account> {
    return await this.userService.getAccount(user.id);
  }
}
