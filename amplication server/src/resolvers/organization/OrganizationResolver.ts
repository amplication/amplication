import { Args, Context, Mutation, Query, ResolveProperty, Resolver, Root } from "@nestjs/graphql";
import { FindManyOrganizationArgs,FindOneArgs,UpdateOneOrganizationArgs, InviteUserArgs } from '../../dto/args';
import { Organization, User } from '../../models';
import { OrganizationService} from '../../core/organization';


@Resolver(_of => Organization)
export class OrganizationResolver {
  constructor(private readonly OrganizationService: OrganizationService) {}

  @Query(_returns => Organization, {
    nullable: true,
    description: undefined
  })
  async Organization(@Context() ctx: any, @Args() args: FindOneArgs): Promise<Organization | null> {
    return this.OrganizationService.Organization(args);
  }

  @Query(_returns => [Organization], {
    nullable: false,
    description: undefined
  })
  async Organizations(@Context() ctx: any, @Args() args: FindManyOrganizationArgs): Promise<Organization[]> {
    return this.OrganizationService.Organizations(args);
  }

  @Mutation(_returns => Organization, {
    nullable: true,
    description: undefined
  })
  async deleteOrganization(@Context() ctx: any, @Args() args: FindOneArgs): Promise<Organization | null> {
    return this.OrganizationService.deleteOrganization(args);
  }

  @Mutation(_returns => Organization, {
    nullable: true,
    description: undefined
  })
  async updateOrganization(@Context() ctx: any, @Args() args: UpdateOneOrganizationArgs): Promise<Organization | null> {
    return this.OrganizationService.updateOrganization(args);
  }


}
