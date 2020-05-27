import {
  Args,
  Context,
  Mutation,
  Query,
  Resolver,
  ResolveField,
  Parent
} from '@nestjs/graphql';
import { CreateOneAppArgs, FindManyAppArgs, UpdateOneAppArgs } from './dto';
import { FindOneArgs } from '../../dto/args';
import { App, Entity } from '../../models';
import { AppService, EntityService } from '../';
import { GqlAuthGuard } from '../../guards/gql-auth.guard';
import { Roles } from '../../decorators/roles.decorator';

import { UseGuards, UseFilters } from '@nestjs/common';
import { GqlResolverExceptionsFilter } from '../../filters/GqlResolverExceptions.filter';
import { UserEntity } from 'src/decorators/user.decorator';

@Resolver(_of => App)
@UseGuards(GqlAuthGuard)
@UseFilters(GqlResolverExceptionsFilter)
export class AppResolver {
  constructor(
    private readonly appService: AppService,
    private readonly entityService: EntityService
  ) {}

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

  @ResolveField(_returns => [Entity])
  async entities(@Parent() app: App): Promise<Entity[]> {
    return this.entityService.entities({ where: { app: { id: app.id } } });
  }

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
