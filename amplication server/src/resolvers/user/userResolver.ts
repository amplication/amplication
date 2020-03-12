import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root,  Parent
 } from "@nestjs/graphql";
import { User, UserRole,Account } from '../../models';
import { UserService, OrganizationService } from '../../core';
import { UserRoleArgs, InviteUserArgs,FindOneArgs,FindManyUserArgs } from '../../dto/args';


@Resolver(_of => User)
export class UserResolver {
  constructor(private readonly userService: UserService,
    private readonly organizationService: OrganizationService) {}

    @Query(_returns => User, {
      nullable: true,
      description: undefined
    })
    async user(@Context() ctx: any, @Args() args: FindOneArgs): Promise<User | null> {
      return this.userService.user(args);
    }



    @Query(_returns => [User], {
      nullable: false,
      description: undefined
    })
    async users(@Context() ctx: any, @Args() args: FindManyUserArgs): Promise<User[]> {
      return this.userService.projects(args);
    }

  @Mutation(_returns => User, {
    nullable: true,
    description: undefined
  })
  async inviteUser(@Context() ctx: any, @Args() args: InviteUserArgs): Promise<User | null> {
    return this.organizationService.inviteUser(args);
  }

  
  @Mutation(_returns => User, {
    nullable: true,
    description: undefined
  })
  async assignRoleToUser(@Context() ctx: any, @Args() args: UserRoleArgs): Promise<User | null> {
    return this.userService.assignRole(args);
  }



  @Mutation(_returns => User, {
    nullable: true,
    description: undefined
  })
  async removeRoleFromUser(@Context() ctx: any, @Args() args: UserRoleArgs): Promise<User | null> {
    return this.userService.removeRole(args);
  }

  @ResolveProperty('userRoles', returns => [UserRole])
  async userRoles(@Parent() user: User ) {
    return await this.userService.getRoles(user.id);
  }

  @ResolveProperty('account', returns => Account)
  async account(@Parent() user: User ) {
    return await this.userService.getAccount(user.id);
  }
}
