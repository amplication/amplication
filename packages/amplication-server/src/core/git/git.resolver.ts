import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';
import { AuthorizeContext } from 'src/decorators/authorizeContext.decorator';
import { InjectContextValue } from 'src/decorators/injectContextValue.decorator';
import { FindOneArgs } from 'src/dto';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';
import { InjectableResourceParameter } from 'src/enums/InjectableResourceParameter';
import { App } from 'src/models/App';
import { GitOrganization } from 'src/models/GitOrganization';
import { GqlResolverExceptionsFilter } from '../../filters/GqlResolverExceptions.filter';
import { GqlAuthGuard } from '../../guards/gql-auth.guard';
import { AuthorizeAppWithGitResult } from '../app/dto/AuthorizeAppWithGitResult';
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

@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class GitResolver {
  constructor(private readonly gitService: GitProviderService) {}
  @Mutation(() => App)
  @AuthorizeContext(
    AuthorizableResourceParameter.GitOrganizationId,
    'data.gitOrganizationId'
  )
  async createGitRepository(
    @Args() args: CreateGitRepositoryArgs
  ): Promise<App> {
    return this.gitService.createGitRepository(args.data);
  }

  @Query(() => GitOrganization)
  @AuthorizeContext(AuthorizableResourceParameter.GitOrganizationId, 'where.id')
  async gitOrganization(@Args() args: FindOneArgs): Promise<GitOrganization> {
    return this.gitService.getGitOrganization(args);
  }

  @Mutation(() => App)
  @AuthorizeContext(
    AuthorizableResourceParameter.GitOrganizationId,
    'data.gitOrganizationId'
  )
  async connectAppGitRepository(
    @Args() args: ConnectGitRepositoryArgs
  ): Promise<App> {
    return await this.gitService.connectAppGitRepository(args.data);
  }

  @Mutation(() => GitOrganization)
  @InjectContextValue(
    InjectableResourceParameter.WorkspaceId,
    'data.workspaceId'
  )
  async createOrganization(
    @Args() args: CreateGitOrganizationArgs
  ): Promise<GitOrganization> {
    return await this.gitService.createGitOrganization(args);
  }

  @Mutation(() => App)
  @AuthorizeContext(
    AuthorizableResourceParameter.GitRepositoryId,
    'gitRepositoryId'
  )
  async deleteGitRepository(
    @Args() args: DeleteGitRepositoryArgs
  ): Promise<App> {
    return this.gitService.deleteGitRepository(args);
  }

  @Mutation(() => Boolean)
  @AuthorizeContext(
    AuthorizableResourceParameter.GitOrganizationId,
    'gitOrganizationId'
  )
  async deleteGitOrganization(
    @Args() args: DeleteGitOrganizationArgs
  ): Promise<boolean> {
    return this.gitService.deleteGitOrganization(args);
  }

  @Mutation(() => AuthorizeAppWithGitResult)
  @InjectContextValue(
    InjectableResourceParameter.WorkspaceId,
    'data.workspaceId'
  )
  async getGitAppInstallationUrl(
    @Args() args: GetGitInstallationUrlArgs
  ): Promise<AuthorizeAppWithGitResult> {
    return {
      url: await this.gitService.getGitInstallationUrl(args)
    };
  }

  @Query(() => [RemoteGitRepository])
  @AuthorizeContext(
    AuthorizableResourceParameter.GitOrganizationId,
    'where.gitOrganizationId'
  )
  async remoteGitRepositories(
    @Args() args: RemoteGitRepositoriesFindManyArgs
  ): Promise<RemoteGitRepository[]> {
    return this.gitService.getReposOfOrganization(args.where);
  }

  @Query(() => [GitOrganization])
  @InjectContextValue(
    InjectableResourceParameter.WorkspaceId,
    'where.workspaceId'
  )
  async gitOrganizations(
    @Args() args: GitOrganizationFindManyArgs
  ): Promise<GitOrganization[]> {
    return this.gitService.getGitOrganizations(args);
  }
}
