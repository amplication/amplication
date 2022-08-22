import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';
import { AuthorizeContext } from 'src/decorators/authorizeContext.decorator';
import { InjectContextValue } from 'src/decorators/injectContextValue.decorator';
import { FindOneArgs } from 'src/dto';
import { AuthorizableOriginParameter } from 'src/enums/AuthorizableOriginParameter';
import { InjectableOriginParameter } from 'src/enums/InjectableOriginParameter';
import { Resource } from 'src/models/Resource';
import { GitOrganization } from 'src/models/GitOrganization';
import { GqlResolverExceptionsFilter } from '../../filters/GqlResolverExceptions.filter';
import { GqlAuthGuard } from '../../guards/gql-auth.guard';
import { AuthorizeResourceWithGitResult } from '../resource/dto/AuthorizeResourceWithGitResult';
import { ConnectGitRepositoryArgs } from './dto/args/ConnectGitRepositoryArgs';
import { CreateGitOrganizationArgs } from './dto/args/CreateGitOrganizationArgs';
import { CreateGitRepositoryArgs } from './dto/args/CreateGitRepositoryArgs';
import { DeleteGitOrganizationArgs } from './dto/args/DeleteGitOrganizationArgs';
import { DeleteGitRepositoryArgs } from './dto/args/DeleteGitRepositoryArgs';
import { GetGitInstallationUrlArgs } from './dto/args/GetGitInstallationUrlArgs';
import { RemoteGitRepositoriesFindManyArgs } from './dto/args/RemoteGitRepositoriesFindManyArgs';
import { GitOrganizationFindManyArgs } from './dto/args/GitOrganizationFindManyArgs';
import { RemoteGitRepository } from './dto/objects/RemoteGitRepository';
import { GitProviderService } from './git.provider.service';
import { DisconnectGitRepositoryArgs } from './dto/args/DisconnectGitRepositoryArgs';
import { ConnectToProjectGitRepositoryArgs } from './dto/args/ConnectToProjectGitRepositoryArgs';

@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class GitResolver {
  constructor(private readonly gitService: GitProviderService) {}
  @Mutation(() => Resource)
  @AuthorizeContext(
    AuthorizableOriginParameter.GitOrganizationId,
    'data.gitOrganizationId'
  )
  async createGitRepository(
    @Args() args: CreateGitRepositoryArgs
  ): Promise<Resource> {
    return this.gitService.createRemoteGitRepository(args.data);
  }

  @Query(() => GitOrganization)
  @AuthorizeContext(AuthorizableOriginParameter.GitOrganizationId, 'where.id')
  async gitOrganization(@Args() args: FindOneArgs): Promise<GitOrganization> {
    return this.gitService.getGitOrganization(args);
  }

  @Mutation(() => Resource)
  @AuthorizeContext(
    AuthorizableOriginParameter.GitOrganizationId,
    'data.gitOrganizationId'
  )
  async connectResourceGitRepository(
    @Args() args: ConnectGitRepositoryArgs
  ): Promise<Resource> {
    return await this.gitService.connectResourceGitRepository(args.data);
  }
  @Mutation(() => Resource)
  @AuthorizeContext(AuthorizableOriginParameter.ResourceId, 'resourceId')
  async connectResourceToProjectRepository(
    @Args() args: ConnectToProjectGitRepositoryArgs
  ): Promise<Resource> {
    return await this.gitService.connectResourceToProjectRepository(
      args.resourceId
    );
  }

  @Mutation(() => GitOrganization)
  @InjectContextValue(InjectableOriginParameter.WorkspaceId, 'data.workspaceId')
  async createOrganization(
    @Args() args: CreateGitOrganizationArgs
  ): Promise<GitOrganization> {
    return await this.gitService.createGitOrganization(args);
  }

  @Mutation(() => Resource)
  @AuthorizeContext(
    AuthorizableOriginParameter.GitRepositoryId,
    'gitRepositoryId'
  )
  async deleteGitRepository(
    @Args() args: DeleteGitRepositoryArgs
  ): Promise<boolean> {
    return this.gitService.deleteGitRepository(args);
  }

  @Mutation(() => Boolean)
  @AuthorizeContext(
    AuthorizableOriginParameter.GitOrganizationId,
    'gitOrganizationId'
  )
  async deleteGitOrganization(
    @Args() args: DeleteGitOrganizationArgs
  ): Promise<boolean> {
    return this.gitService.deleteGitOrganization(args);
  }

  @Mutation(() => Resource)
  @AuthorizeContext(AuthorizableOriginParameter.ResourceId, 'resourceId')
  async disconnectResourceGitRepository(
    @Args() args: DisconnectGitRepositoryArgs
  ): Promise<Resource> {
    return this.gitService.disconnectResourceGitRepository(args.resourceId);
  }

  @Mutation(() => AuthorizeResourceWithGitResult)
  @InjectContextValue(InjectableOriginParameter.WorkspaceId, 'data.workspaceId')
  async getGitResourceInstallationUrl(
    @Args() args: GetGitInstallationUrlArgs
  ): Promise<AuthorizeResourceWithGitResult> {
    return {
      url: await this.gitService.getGitInstallationUrl(args)
    };
  }

  @Query(() => [RemoteGitRepository])
  @AuthorizeContext(
    AuthorizableOriginParameter.GitOrganizationId,
    'where.gitOrganizationId'
  )
  async remoteGitRepositories(
    @Args() args: RemoteGitRepositoriesFindManyArgs
  ): Promise<RemoteGitRepository[]> {
    return this.gitService.getReposOfOrganization(args.where);
  }

  @Query(() => [GitOrganization])
  @InjectContextValue(
    InjectableOriginParameter.WorkspaceId,
    'where.workspaceId'
  )
  async gitOrganizations(
    @Args() args: GitOrganizationFindManyArgs
  ): Promise<GitOrganization[]> {
    return this.gitService.getGitOrganizations(args);
  }
}
