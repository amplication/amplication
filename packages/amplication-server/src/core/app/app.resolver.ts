import {
  Args,
  Mutation,
  Query,
  Resolver,
  ResolveField,
  Parent
} from '@nestjs/graphql';
import {
  CreateOneAppArgs,
  FindManyAppArgs,
  UpdateOneAppArgs,
  CreateCommitArgs,
  FindPendingChangesArgs,
  PendingChange
} from './dto';
import { FindOneArgs } from 'src/dto';
import { App, Entity, User, Commit } from 'src/models';
import { AppService, EntityService } from '../';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { Roles } from 'src/decorators/roles.decorator';

import { UseGuards, UseFilters } from '@nestjs/common';
import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';
import { UserEntity } from 'src/decorators/user.decorator';
import { AuthorizeContext } from 'src/decorators/authorizeContext.decorator';
import { InjectContextValue } from 'src/decorators/injectContextValue.decorator';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';
import { InjectableResourceParameter } from 'src/enums/InjectableResourceParameter';

@Resolver(() => App)
@UseGuards(GqlAuthGuard)
@UseFilters(GqlResolverExceptionsFilter)
export class AppResolver {
  constructor(
    private readonly appService: AppService,
    private readonly entityService: EntityService
  ) {}

  @Query(() => App, { nullable: true })
  @Roles('ORGANIZATION_ADMIN')
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'where.id')
  async app(@Args() args: FindOneArgs): Promise<App | null> {
    return this.appService.app(args);
  }

  @Query(() => [App], {
    nullable: false,
    description: undefined
  })
  @Roles('ORGANIZATION_ADMIN')
  @InjectContextValue(
    InjectableResourceParameter.OrganizationId,
    'where.organization.id'
  )
  async apps(@Args() args: FindManyAppArgs): Promise<App[]> {
    return this.appService.apps(args);
  }

  // args.data.organization = {
  //   connect: {
  //     id :'FA90A838-EBFE-4162-9746-22CC9FE49B62'
  //   }
  // }

  @ResolveField(() => [Entity])
  async entities(@Parent() app: App): Promise<Entity[]> {
    return this.entityService.entities({ where: { app: { id: app.id } } });
  }

  @Mutation(() => App, { nullable: false })
  @Roles('ORGANIZATION_ADMIN')
  @InjectContextValue(
    InjectableResourceParameter.OrganizationId,
    'data.organization.connect.id'
  )
  async createApp(
    @Args() args: CreateOneAppArgs,
    @UserEntity() user: User
  ): Promise<App> {
    return this.appService.createApp(args, user);
  }

  @Mutation(() => App, {
    nullable: true,
    description: undefined
  })
  async deleteApp(@Args() args: FindOneArgs): Promise<App | null> {
    return this.appService.deleteApp(args);
  }

  @Mutation(() => App, {
    nullable: true,
    description: undefined
  })
  async updateApp(@Args() args: UpdateOneAppArgs): Promise<App | null> {
    return this.appService.updateApp(args);
  }

  @Mutation(() => Commit, {
    nullable: true,
    description: undefined
  })
  @Roles('ORGANIZATION_ADMIN')
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'data.app.connect.id')
  @InjectContextValue(
    InjectableResourceParameter.UserId,
    'data.user.connect.id'
  )
  async commit(@Args() args: CreateCommitArgs): Promise<Commit | null> {
    return this.appService.commit(args);
  }

  @Query(() => [PendingChange], {
    nullable: false,
    description: undefined
  })
  @Roles('ORGANIZATION_ADMIN')
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'where.app.id')
  async pendingChanges(
    @Args() args: FindPendingChangesArgs,
    @UserEntity() user: User
  ): Promise<PendingChange[]> {
    return this.appService.getPendingChanges(args, user);
  }
}
