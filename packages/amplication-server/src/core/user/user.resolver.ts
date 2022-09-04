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
  //
  // })
  // async user(@Args() args: FindOneArgs): Promise<User | null> {
  //   return this.userService.findUser(args);
  // }

  // @Query(() => [User], {
  //   nullable: false,
  //
  // })
  // async users(@Args() args: FindManyUserArgs): Promise<User[]> {
  //   return this.userService.findUsers(args);
  // }

  // @Mutation(() => User, {
  //   nullable: true,
  //
  // })
  // async assignRoleToUser(@Args() args: UserRoleArgs): Promise<User | null> {
  //   return this.userService.assignRole(args);
  // }

  // @Mutation(() => User, {
  //   nullable: true,
  //
  // })
  // async removeRoleFromUser(@Args() args: UserRoleArgs): Promise<User | null> {
  //   return this.userService.removeRole(args);
  // }

  @ResolveField(() => [UserRole])
  async userRoles(@Parent() user: User) {
    return await this.userService.getRoles(user.id);
  }

  @ResolveField(() => Account)
  async account(@Parent() user: User) {
    return await this.userService.getAccount(user.id);
  }
}
