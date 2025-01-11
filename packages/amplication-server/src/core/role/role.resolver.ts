import { UseFilters, UseGuards } from "@nestjs/common";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { InjectContextValue } from "../../decorators/injectContextValue.decorator";
import { UserEntity } from "../../decorators/user.decorator";
import { FindOneArgs } from "../../dto";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { InjectableOriginParameter } from "../../enums/InjectableOriginParameter";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { Role, User } from "../../models";
import { RoleAddRemovePermissionsArgs } from "./dto/RoleAddRemovePermissionsArgs";
import { RoleCreateArgs } from "./dto/RoleCreateArgs";
import { RoleFindManyArgs } from "./dto/RoleFindManyArgs";
import { UpdateRoleArgs } from "./dto/UpdateRoleArgs";
import { RoleService } from "./role.service";

@Resolver(() => Role)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class RoleResolver {
  constructor(private roleService: RoleService) {}

  @Query(() => [Role], { nullable: false })
  @InjectContextValue(
    InjectableOriginParameter.WorkspaceId,
    "where.workspace.id"
  )
  async roles(@Args() args: RoleFindManyArgs): Promise<Role[]> {
    return this.roleService.roles(args);
  }

  @Query(() => Role, { nullable: true })
  @AuthorizeContext(AuthorizableOriginParameter.RoleId, "where.id")
  async role(@Args() args: FindOneArgs): Promise<Role | null> {
    return this.roleService.role(args);
  }

  @Mutation(() => Role, { nullable: false })
  @InjectContextValue(
    InjectableOriginParameter.WorkspaceId,
    "data.workspace.connect.id",
    "role.create"
  )
  async createRole(
    @Args() args: RoleCreateArgs,
    @UserEntity() user: User
  ): Promise<Role> {
    return this.roleService.createRole(args);
  }

  @Mutation(() => Role, { nullable: true })
  @AuthorizeContext(
    AuthorizableOriginParameter.RoleId,
    "where.id",
    "role.delete"
  )
  async deleteRole(@Args() args: FindOneArgs): Promise<Role | null> {
    return this.roleService.deleteRole(args);
  }

  @Mutation(() => Role, { nullable: false })
  @AuthorizeContext(AuthorizableOriginParameter.RoleId, "where.id", "role.edit")
  async updateRole(@Args() args: UpdateRoleArgs): Promise<Role> {
    return this.roleService.updateRole(args);
  }

  @Mutation(() => Role, { nullable: false })
  @AuthorizeContext(AuthorizableOriginParameter.RoleId, "where.id", "role.edit")
  async addRolePermissions(
    @Args() args: RoleAddRemovePermissionsArgs
  ): Promise<Role> {
    return this.roleService.addPermission(args);
  }

  @Mutation(() => Role, { nullable: false })
  @AuthorizeContext(AuthorizableOriginParameter.RoleId, "where.id", "role.edit")
  async removeRolePermissions(
    @Args() args: RoleAddRemovePermissionsArgs
  ): Promise<Role> {
    return this.roleService.removePermission(args);
  }
}
