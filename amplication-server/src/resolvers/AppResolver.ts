import {
  Args,
  Context,
  Mutation,
  Query,
  ResolveProperty,
  Resolver,
  Root
} from '@nestjs/graphql';
import {
  CreateOneAppArgs,
  FindManyAppArgs,
  FindOneArgs,
  UpdateOneAppArgs
} from '../dto/args';
import { App } from '../models';
import { AppService } from '../core';
import { GqlAuthGuard } from '../guards/gql-auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { ResourceBasedAuth } from '../decorators/resourceBasedAuth.decorator';
import { ResourceBasedAuthParamType } from '../decorators/resourceBasedAuthParams.dto';

import { UseGuards, Inject, UseFilters } from '@nestjs/common';
import { GqlResolverExceptionsFilter } from '../filters/GqlResolverExceptions.filter';

@Resolver(_of => App)
@UseGuards(GqlAuthGuard)
@UseFilters(GqlResolverExceptionsFilter)
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query(_returns => App, {
    nullable: true,
    description: undefined
  })
  @Roles('ORGANIZATION_ADMIN')
  @ResourceBasedAuth('where.id', ResourceBasedAuthParamType.AppId)
  async app(@Args() args: FindOneArgs): Promise<App | null> {
    return this.appService.app(args);
  }

  @Query(_returns => [App], {
    nullable: false,
    description: undefined
  })
  @Roles('ORGANIZATION_ADMIN')
  @ResourceBasedAuth(
    'where.organization.id',
    ResourceBasedAuthParamType.OrganizationId,
    true
  )
  async apps(@Args() args: FindManyAppArgs): Promise<App[]> {
    return this.appService.apps(args);
  }

  // args.data.organization = {
  //   connect: {
  //     id :'FA90A838-EBFE-4162-9746-22CC9FE49B62'
  //   }
  // }

  @Mutation(_returns => App, {
    nullable: false,
    description: undefined
  })
  @Roles('ORGANIZATION_ADMIN')
  @ResourceBasedAuth(
    'data.organization.connect.id',
    ResourceBasedAuthParamType.OrganizationId,
    true
  )
  async createApp(
    @Context() ctx: any,
    @Args() args: CreateOneAppArgs
  ): Promise<App> {
    return this.appService.createApp(args);
  }

  @Mutation(_returns => App, {
    nullable: true,
    description: undefined
  })
  async deleteApp(
    @Context() ctx: any,
    @Args() args: FindOneArgs
  ): Promise<App | null> {
    return this.appService.deleteApp(args);
  }

  @Mutation(_returns => App, {
    nullable: true,
    description: undefined
  })
  async updateApp(
    @Context() ctx: any,
    @Args() args: UpdateOneAppArgs
  ): Promise<App | null> {
    return this.appService.updateApp(args);
  }
}
