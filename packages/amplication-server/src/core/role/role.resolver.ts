import { UseFilters, UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { InjectContextValue } from "../../decorators/injectContextValue.decorator";
import { Roles } from "../../decorators/roles.decorator";
import { UserEntity } from "../../decorators/user.decorator";
import { FindOneArgs } from "../../dto";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { InjectableOriginParameter } from "../../enums/InjectableOriginParameter";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { Role, User } from "../../models";
import { RoleService } from "./role.service";
import { RoleCreateArgs } from "./dto/RoleCreateArgs";
import { RoleFindManyArgs } from "./dto/RoleFindManyArgs";
import { UpdateRoleArgs } from "./dto/UpdateRoleArgs";
import { CreateRoleOptionArgs } from "./dto/CreateRoleOptionArgs";
import { UpdateRoleOptionArgs } from "./dto/UpdateRoleOptionArgs";
import { DeleteRoleOptionArgs } from "./dto/DeleteRoleOptionArgs.ts";

@Resolver(() => Role)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class RoleResolver {
  constructor(private roleService: RoleService) {}

  @Query(() => [Role], { nullable: false })
  @Roles("ORGANIZATION_ADMIN")
  @InjectContextValue(
    InjectableOriginParameter.WorkspaceId,
    "where.workspace.id"
  )
  async roles(@Args() args: RoleFindManyArgs): Promise<Role[]> {
    return this.roleService.roles(args);
  }

  @Query(() => Role, { nullable: true })
  @Roles("ORGANIZATION_ADMIN")
  @AuthorizeContext(AuthorizableOriginParameter.RoleId, "where.id")
  async role(@Args() args: FindOneArgs): Promise<Role | null> {
    return this.roleService.role(args);
  }

  @Mutation(() => Role, { nullable: false })
  @Roles("ORGANIZATION_ADMIN")
  @InjectContextValue(
    InjectableOriginParameter.WorkspaceId,
    "data.workspace.connect.id"
  )
  async createRole(
    @Args() args: RoleCreateArgs,
    @UserEntity() user: User
  ): Promise<Role> {
    return this.roleService.createRole(args);
  }

  @Mutation(() => Role, { nullable: true })
  @Roles("ORGANIZATION_ADMIN")
  @AuthorizeContext(AuthorizableOriginParameter.RoleId, "where.id")
  async deleteRole(@Args() args: FindOneArgs): Promise<Role | null> {
    return this.roleService.deleteRole(args);
  }

  @Mutation(() => Role, { nullable: false })
  @Roles("ORGANIZATION_ADMIN")
  @AuthorizeContext(AuthorizableOriginParameter.RoleId, "where.id")
  async updateRole(@Args() args: UpdateRoleArgs): Promise<Role> {
    return this.roleService.updateRole(args);
  }
}
