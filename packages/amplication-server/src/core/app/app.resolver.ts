import { UseFilters, UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver
} from '@nestjs/graphql';
import { AuthorizeContext } from 'src/decorators/authorizeContext.decorator';
import { InjectContextValue } from 'src/decorators/injectContextValue.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { UserEntity } from 'src/decorators/user.decorator';
import { FindOneArgs } from 'src/dto';
import { AuthorizableOriginParameter } from 'src/enums/AuthorizableOriginParameter';
import { InjectableOriginParameter } from 'src/enums/InjectableOriginParameter';
import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { App, Commit, Entity, User, Workspace } from 'src/models';
import { GitRepository } from 'src/models/GitRepository';
import { AppService, EntityService } from '../';
import { BuildService } from '../build/build.service';
import { Build } from '../build/dto/Build';
import { FindManyBuildArgs } from '../build/dto/FindManyBuildArgs';
import { FindManyEntityArgs } from '../entity/dto';
import { Environment } from '../environment/dto/Environment';
import { EnvironmentService } from '../environment/environment.service';
import {
  CreateAppWithEntitiesArgs,
  CreateCommitArgs,
  CreateOneAppArgs,
  DiscardPendingChangesArgs,
  FindManyAppArgs,
  FindPendingChangesArgs,
  PendingChange,
  UpdateOneAppArgs
} from './dto';

@Resolver(() => App)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class AppResolver {
  constructor(
    private readonly appService: AppService,
    private readonly entityService: EntityService,
    private readonly buildService: BuildService,
    private readonly environmentService: EnvironmentService
  ) {}

  @Query(() => App, { nullable: true })
  @Roles('ORGANIZATION_ADMIN')
  @AuthorizeContext(AuthorizableOriginParameter.AppId, 'where.id')
  async app(@Args() args: FindOneArgs): Promise<App | null> {
    return this.appService.app(args);
  }

  @Query(() => [App], {
    nullable: false,
    description: undefined
  })
  @Roles('ORGANIZATION_ADMIN')
  @InjectContextValue(
    InjectableOriginParameter.WorkspaceId,
    'where.workspace.id'
  )
  async apps(@Args() args: FindManyAppArgs): Promise<App[]> {
    return this.appService.apps(args);
  }

  @ResolveField(() => [Entity])
  async entities(
    @Parent() app: App,
    @Args() args: FindManyEntityArgs
  ): Promise<Entity[]> {
    return this.entityService.entities({
      ...args,
      where: { ...args.where, app: { id: app.id } }
    });
  }

  @ResolveField(() => [Build])
  async builds(
    @Parent() app: App,
    @Args() args: FindManyBuildArgs
  ): Promise<Build[]> {
    return this.buildService.findMany({
      ...args,
      where: { ...args.where, app: { id: app.id } }
    });
  }

  @ResolveField(() => [Environment])
  async environments(@Parent() app: App): Promise<Environment[]> {
    return this.environmentService.findMany({
      where: { app: { id: app.id } }
    });
  }

  @Mutation(() => App, { nullable: false })
  @Roles('ORGANIZATION_ADMIN')
  @InjectContextValue(
    InjectableOriginParameter.WorkspaceId,
    'data.workspace.connect.id'
  )
  async createApp(
    @Args() args: CreateOneAppArgs,
    @UserEntity() user: User
  ): Promise<App> {
    return this.appService.createApp(args, user);
  }

  @Mutation(() => App, { nullable: false })
  @Roles('ORGANIZATION_ADMIN')
  @InjectContextValue(
    InjectableOriginParameter.WorkspaceId,
    'data.app.workspace.connect.id'
  )
  async createAppWithEntities(
    @Args() args: CreateAppWithEntitiesArgs,
    @UserEntity() user: User
  ): Promise<App> {
    return this.appService.createAppWithEntities(args.data, user);
  }

  @Mutation(() => App, {
    nullable: true,
    description: undefined
  })
  @AuthorizeContext(AuthorizableOriginParameter.AppId, 'where.id')
  async deleteApp(@Args() args: FindOneArgs): Promise<App | null> {
    return this.appService.deleteApp(args);
  }

  @Mutation(() => App, {
    nullable: true,
    description: undefined
  })
  @AuthorizeContext(AuthorizableOriginParameter.AppId, 'where.id')
  async updateApp(@Args() args: UpdateOneAppArgs): Promise<App | null> {
    return this.appService.updateApp(args);
  }

  @Mutation(() => Commit, {
    nullable: true,
    description: undefined
  })
  @AuthorizeContext(AuthorizableOriginParameter.AppId, 'data.app.connect.id')
  @InjectContextValue(InjectableOriginParameter.UserId, 'data.user.connect.id')
  async commit(@Args() args: CreateCommitArgs): Promise<Commit | null> {
    return this.appService.commit(args);
  }

  @Mutation(() => Boolean, {
    nullable: true,
    description: undefined
  })
  @AuthorizeContext(AuthorizableOriginParameter.AppId, 'data.app.connect.id')
  @InjectContextValue(InjectableOriginParameter.UserId, 'data.user.connect.id')
  async discardPendingChanges(
    @Args() args: DiscardPendingChangesArgs
  ): Promise<boolean | null> {
    return this.appService.discardPendingChanges(args);
  }

  @Query(() => [PendingChange], {
    nullable: false
  })
  @AuthorizeContext(AuthorizableOriginParameter.AppId, 'where.app.id')
  async pendingChanges(
    @Args() args: FindPendingChangesArgs,
    @UserEntity() user: User
  ): Promise<PendingChange[]> {
    return this.appService.getPendingChanges(args, user);
  }

  @ResolveField(() => GitRepository, { nullable: true })
  async gitRepository(@Parent() app: App): Promise<GitRepository | null> {
    return await this.appService.gitRepository(app.id);
  }

  @ResolveField(() => Workspace)
  async workspace(@Parent() app: App): Promise<Workspace> {
    return this.appService.workspace(app.id);
  }
}
