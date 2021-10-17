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
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';
import { InjectableResourceParameter } from 'src/enums/InjectableResourceParameter';
import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { App, Commit, Entity, User } from 'src/models';
import { AppService, EntityService } from '../';
import { BuildService } from '../build/build.service';
import { Build } from '../build/dto/Build';
import { FindManyBuildArgs } from '../build/dto/FindManyBuildArgs';
import { FindManyEntityArgs } from '../entity/dto';
import { Environment } from '../environment/dto/Environment';
import { EnvironmentService } from '../environment/environment.service';
import {
  AppEnableSyncWithGithubRepoArgs,
  AppValidationResult,
  CreateAppWithEntitiesArgs,
  CreateCommitArgs,
  CreateOneAppArgs,
  DiscardPendingChangesArgs,
  FindManyAppArgs,
  FindPendingChangesArgs,
  PendingChange,
  UpdateOneAppArgs
} from './dto';
import { AuthorizeAppWithGithubResult } from './dto/AuthorizeAppWithGithubResult';
import { CompleteAuthorizeAppWithGithubArgs } from './dto/CompleteAuthorizeAppWithGithubArgs';

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
    InjectableResourceParameter.WorkspaceId,
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
    InjectableResourceParameter.WorkspaceId,
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
    InjectableResourceParameter.WorkspaceId,
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
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'where.id')
  async deleteApp(@Args() args: FindOneArgs): Promise<App | null> {
    return this.appService.deleteApp(args);
  }

  @Mutation(() => App, {
    nullable: true,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'where.id')
  async updateApp(@Args() args: UpdateOneAppArgs): Promise<App | null> {
    return this.appService.updateApp(args);
  }

  @Mutation(() => Commit, {
    nullable: true,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'data.app.connect.id')
  @InjectContextValue(
    InjectableResourceParameter.UserId,
    'data.user.connect.id'
  )
  async commit(@Args() args: CreateCommitArgs): Promise<Commit | null> {
    return this.appService.commit(args);
  }

  @Mutation(() => Boolean, {
    nullable: true,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'data.app.connect.id')
  @InjectContextValue(
    InjectableResourceParameter.UserId,
    'data.user.connect.id'
  )
  async discardPendingChanges(
    @Args() args: DiscardPendingChangesArgs
  ): Promise<boolean | null> {
    return this.appService.discardPendingChanges(args);
  }

  @Query(() => [PendingChange], {
    nullable: false
  })
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'where.app.id')
  async pendingChanges(
    @Args() args: FindPendingChangesArgs,
    @UserEntity() user: User
  ): Promise<PendingChange[]> {
    return this.appService.getPendingChanges(args, user);
  }

  @Mutation(() => AuthorizeAppWithGithubResult, {
    nullable: false
  })
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'where.id')
  async startAuthorizeAppWithGithub(
    @Args() args: FindOneArgs,
    @UserEntity() user: User
  ): Promise<AuthorizeAppWithGithubResult> {
    return {
      url: await this.appService.startAuthorizeAppWithGithub(args.where.id)
    };
  }

  @Mutation(() => App, {
    nullable: false
  })
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'where.id')
  async completeAuthorizeAppWithGithub(
    @Args() args: CompleteAuthorizeAppWithGithubArgs,
    @UserEntity() user: User
  ): Promise<App> {
    return this.appService.completeAuthorizeAppWithGithub(args);
  }

  @Mutation(() => App, {
    nullable: false
  })
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'where.id')
  async removeAuthorizeAppWithGithub(
    @Args() args: FindOneArgs,
    @UserEntity() user: User
  ): Promise<App> {
    return this.appService.removeAuthorizeAppWithGithub(args);
  }

  @Mutation(() => App, {
    nullable: false
  })
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'where.id')
  async appEnableSyncWithGithubRepo(
    @Args() args: AppEnableSyncWithGithubRepoArgs
  ): Promise<App> {
    return this.appService.enableSyncWithGithubRepo(args);
  }

  @Mutation(() => App, {
    nullable: false
  })
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'where.id')
  async appDisableSyncWithGithubRepo(@Args() args: FindOneArgs): Promise<App> {
    return this.appService.disableSyncWithGithubRepo(args);
  }

  @Query(() => AppValidationResult, {
    nullable: false
  })
  @AuthorizeContext(AuthorizableResourceParameter.AppId, 'where.id')
  async appValidateBeforeCommit(
    @Args() args: FindOneArgs
  ): Promise<AppValidationResult> {
    return this.appService.validateBeforeCommit(args);
  }
}
