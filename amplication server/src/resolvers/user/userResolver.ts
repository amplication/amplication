import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
import {InviteUserArgs } from '../../dto/args';
import { User } from '../../models';
import { OrganizationService} from '../../core/organization';


@Resolver(_of => User)
export class UserResolver {
  constructor(private readonly OrganizationService: OrganizationService) {}

  
  @Mutation(_returns => User, {
    nullable: true,
    description: undefined
  })
  async InviteUser(@Context() ctx: any, @Args() args: InviteUserArgs): Promise<User | null> {
    return this.OrganizationService.inviteUser(args);
  }

}
