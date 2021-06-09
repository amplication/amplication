import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseFilters } from '@nestjs/common';
import { AuthorizeContext } from 'src/decorators/authorizeContext.decorator';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';
import {
  CreateAppRoleArgs,
  FindManyAppRoleArgs,
  UpdateOneAppRoleArgs,
  FindOneAppRoleArgs,
  DeleteAppRoleArgs
} from './dto';
import { AppRole } from 'src/models';
import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';
import { AppRoleService } from './appRole.service';

@Resolver(() => AppRole)
@UseFilters(GqlResolverExceptionsFilter)
export class AppRoleResolver {
  constructor(private readonly appRoleService: AppRoleService) {}
  @Query(() => AppRole, {
    nullable: true,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.BlockId, 'where.id')
  async appRole(@Args() args: FindOneAppRoleArgs): Promise<AppRole | null> {
    return this.appRoleService.getAppRole(args);
  }

  @Query(() => [AppRole], {
    nullable: false,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'where.app.id')
  async appRoles(@Args() args: FindManyAppRoleArgs): Promise<AppRole[]> {
    return this.appRoleService.getAppRoles(args);
  }

  @Mutation(() => AppRole, {
    nullable: false,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'data.app.connect.id')
  async createAppRole(@Args() args: CreateAppRoleArgs): Promise<AppRole> {
    return this.appRoleService.createAppRole(args);
  }

  @Mutation(() => AppRole, {
    nullable: true,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.AppRoleId, 'where.id')
  async deleteAppRole(
    @Args() args: DeleteAppRoleArgs
  ): Promise<AppRole | null> {
    return this.appRoleService.deleteAppRole(args);
  }

  @Mutation(() => AppRole, {
    nullable: true,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.AppRoleId, 'where.id')
  async updateAppRole(
    @Args() args: UpdateOneAppRoleArgs
  ): Promise<AppRole | null> {
    return this.appRoleService.updateAppRole(args);
  }
}
