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
import { Resource, Commit, Entity, User, Workspace } from 'src/models';
import { GitRepository } from 'src/models/GitRepository';
import { ResourceService, EntityService } from '..';
import { BuildService } from '../build/build.service';
import { Build } from '../build/dto/Build';
import { FindManyBuildArgs } from '../build/dto/FindManyBuildArgs';
import { FindManyEntityArgs } from '../entity/dto';
import { Environment } from '../environment/dto/Environment';
import { EnvironmentService } from '../environment/environment.service';
import {
  AppValidationResult,
  CreateAppWithEntitiesArgs,
  CreateCommitArgs,
  CreateOneResourceArgs,
  DiscardPendingChangesArgs,
  FindManyAppArgs,
  FindPendingChangesArgs,
  PendingChange,
  UpdateOneAppArgs
} from './dto';

@Resolver(() => Resource)
@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class ResourceResolver {
  constructor(
    private readonly resourceService: ResourceService,
    private readonly entityService: EntityService,
    private readonly buildService: BuildService,
    private readonly environmentService: EnvironmentService
  ) {}

  @Query(() => Resource, { nullable: true })
  @Roles('ORGANIZATION_ADMIN')
  @AuthorizeContext(AuthorizableResourceParameter.ResourceId, 'where.id')
  async app(@Args() args: FindOneArgs): Promise<Resource | null> {
    return this.resourceService.resource(args);
  }

  @Query(() => [Resource], {
    nullable: false,
    description: undefined
  })
  @Roles('ORGANIZATION_ADMIN')
  @InjectContextValue(
    InjectableResourceParameter.WorkspaceId,
    'where.workspace.id'
  )
  async apps(@Args() args: FindManyAppArgs): Promise<Resource[]> {
    return this.resourceService.resources(args);
  }

  @ResolveField(() => [Entity])
  async entities(
    @Parent() resource: Resource,
    @Args() args: FindManyEntityArgs
  ): Promise<Entity[]> {
    return this.entityService.entities({
      ...args,
      where: { ...args.where, resource: { id: resource.id } }
    });
  }

  @ResolveField(() => [Build])
  async builds(
    @Parent() resource: Resource,
    @Args() args: FindManyBuildArgs
  ): Promise<Build[]> {
    return this.buildService.findMany({
      ...args,
      where: { ...args.where, resource: { id: resource.id } }
    });
  }

  @ResolveField(() => [Environment])
  async environments(@Parent() app: Resource): Promise<Environment[]> {
    return this.environmentService.findMany({
      where: { resource: { id: app.id } }
    });
  }

  @Mutation(() => Resource, { nullable: false })
  @Roles('ORGANIZATION_ADMIN')
  @InjectContextValue(
    InjectableResourceParameter.WorkspaceId,
    'data.workspace.connect.id'
  )
  async createApp(
    @Args() args: CreateOneResourceArgs,
    @UserEntity() user: User
  ): Promise<Resource> {
    return this.resourceService.createResource(args, user);
  }

  @Mutation(() => Resource, { nullable: false })
  @Roles('ORGANIZATION_ADMIN')
  @InjectContextValue(
    InjectableResourceParameter.WorkspaceId,
    'data.app.workspace.connect.id'
  )
  async createAppWithEntities(
    @Args() args: CreateAppWithEntitiesArgs,
    @UserEntity() user: User
  ): Promise<Resource> {
    return this.resourceService.createResourceWithEntities(args.data, user);
  }

  @Mutation(() => Resource, {
    nullable: true,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.ResourceId, 'where.id')
  async deleteApp(@Args() args: FindOneArgs): Promise<Resource | null> {
    return this.resourceService.deleteApp(args);
  }

  @Mutation(() => Resource, {
    nullable: true,
    description: undefined
  })
  @AuthorizeContext(AuthorizableResourceParameter.ResourceId, 'where.id')
  async updateApp(@Args() args: UpdateOneAppArgs): Promise<Resource | null> {
    return this.resourceService.updateResource(args);
  }

  @Mutation(() => Commit, {
    nullable: true,
    description: undefined
  })
  @AuthorizeContext(
    AuthorizableResourceParameter.ResourceId,
    'data.app.connect.id'
  )
  @InjectContextValue(
    InjectableResourceParameter.UserId,
    'data.user.connect.id'
  )
  async commit(@Args() args: CreateCommitArgs): Promise<Commit | null> {
    return this.resourceService.commit(args);
  }

  @Mutation(() => Boolean, {
    nullable: true,
    description: undefined
  })
  @AuthorizeContext(
    AuthorizableResourceParameter.ResourceId,
    'data.app.connect.id'
  )
  @InjectContextValue(
    InjectableResourceParameter.UserId,
    'data.user.connect.id'
  )
  async discardPendingChanges(
    @Args() args: DiscardPendingChangesArgs
  ): Promise<boolean | null> {
    return this.resourceService.discardPendingChanges(args);
  }

  @Query(() => [PendingChange], {
    nullable: false
  })
  @AuthorizeContext(AuthorizableResourceParameter.ResourceId, 'where.app.id')
  async pendingChanges(
    @Args() args: FindPendingChangesArgs,
    @UserEntity() user: User
  ): Promise<PendingChange[]> {
    return this.resourceService.getPendingChanges(args, user);
  }

  @Query(() => AppValidationResult, {
    nullable: false
  })
  @AuthorizeContext(AuthorizableResourceParameter.ResourceId, 'where.id')
  async appValidateBeforeCommit(
    @Args() args: FindOneArgs
  ): Promise<AppValidationResult> {
    return this.resourceService.validateBeforeCommit(args);
  }

  @ResolveField(() => GitRepository, { nullable: true })
  async gitRepository(
    @Parent() resource: Resource
  ): Promise<GitRepository | null> {
    return await this.resourceService.gitRepository(resource.id);
  }

  @ResolveField(() => Workspace)
  async workspace(@Parent() resource: Resource): Promise<Workspace> {
    return this.resourceService.workspace(resource.id);
  }
}
