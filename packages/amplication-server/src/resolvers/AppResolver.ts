import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  ArgsType,
  Field,
  InputType
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

import { UseGuards, UseFilters } from '@nestjs/common';
import { GqlResolverExceptionsFilter } from '../filters/GqlResolverExceptions.filter';
import { WhereUniqueInput } from 'src/dto/inputs';
import { UserEntity } from 'src/decorators/user.decorator';

@Resolver(_of => App)
@UseGuards(GqlAuthGuard)
@UseFilters(GqlResolverExceptionsFilter)
export class AppResolver {
  constructor(private readonly appService: AppService) {}

  @Query(_returns => App, { nullable: true })
  @Roles('ORGANIZATION_ADMIN')
  async app(@Args() args: FindOneArgs): Promise<App | null> {
    return this.appService.app(args);
  }

  @Query(_returns => [App], {
    nullable: false,
    description: undefined
  })
  @Roles('ORGANIZATION_ADMIN')
  async apps(@Args() args: FindManyAppArgs): Promise<App[]> {
    return this.appService.apps(args);
  }

  // args.data.organization = {
  //   connect: {
  //     id :'FA90A838-EBFE-4162-9746-22CC9FE49B62'
  //   }
  // }

  @Mutation(_returns => App, { nullable: false })
  @Roles('ORGANIZATION_ADMIN')
  async createApp(
    @Args() args: CreateOneAppArgs,
    @UserEntity() user
  ): Promise<App> {
    return this.appService.createApp(args, user);
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
