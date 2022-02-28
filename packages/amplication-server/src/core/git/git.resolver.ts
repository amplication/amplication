import { UseFilters, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query } from '@nestjs/graphql';
import { AuthorizeContext } from 'src/decorators/authorizeContext.decorator';
import { InjectContextValue } from 'src/decorators/injectContextValue.decorator';
import { FindOneArgs } from 'src/dto';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';
import { InjectableResourceParameter } from 'src/enums/InjectableResourceParameter';
import { GitOrganization } from 'src/models/GitOrganization';
import { GqlResolverExceptionsFilter } from '../../filters/GqlResolverExceptions.filter';
import { GqlAuthGuard } from '../../guards/gql-auth.guard';
import { AuthorizeAppWithGitResult } from '../app/dto/AuthorizeAppWithGitResult';
import { CreateGitOrganizationArgs } from './dto/args/CreateGitOrganizationArgs';
import { CreateGitRepositoryArgs } from './dto/args/CreateGitRepositoryArgs';
import { GitOrganizationFindManyArgs } from './dto/args/GitOrganizationFindManyArgs';
import { GetGitInstallationUrlArgs } from './dto/args/GetGitInstallationUrlArgs';
import { GetReposListArgs } from './dto/args/GetReposListArgs';
import { GitRepo } from './dto/objects/GitRepo';
import { GitService } from './git.service';
import { GitRepository } from 'src/models/GitRepository';
import { DeleteGitRepositoryArgs } from './dto/args/DeleteGitRepositoryArgs';
import { DeleteGitOrganizationArgs } from './dto/args/DeleteGitOrganizationArgs';
import { ConnectGitRepositoryArgs } from './dto/args/ConnectGitRepositoryArgs';

@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class GitResolver {
  constructor(private readonly gitService: GitService) {}
  //#region Mutation
  @Mutation(() => GitRepo)
  @AuthorizeContext(
    AuthorizableResourceParameter.GitOrganizationId,
    'data.gitOrganizationId'
  )
  async createGitRepository(
    @Args() args: CreateGitRepositoryArgs
  ): Promise<GitRepo> {
    return this.gitService.createGitRepository(args.data);
  }

  @Query(() => GitOrganization)
  @AuthorizeContext(AuthorizableResourceParameter.GitOrganizationId, 'where.id')
  async gitOrganization(@Args() args: FindOneArgs): Promise<GitOrganization> {
    return this.gitService.getGitOrganization(args);
  }
  @Mutation(() => GitRepository)
  @AuthorizeContext(
    AuthorizableResourceParameter.GitOrganizationId,
    'data.gitOrganizationId'
  )
  async connectGitRepository(
    @Args() args: ConnectGitRepositoryArgs
  ): Promise<GitRepository> {
    return await this.gitService.connectGitRepository(args.data);
  }

  @Mutation(() => GitOrganization)
  @InjectContextValue(
    InjectableResourceParameter.WorkspaceId,
    'where.workspaceId'
  )
  async createOrganization(
    @Args() args: CreateGitOrganizationArgs
  ): Promise<GitOrganization> {
    return await this.gitService.createGitOrganization(args);
  }

  @Mutation(() => Boolean)
  @AuthorizeContext(
    AuthorizableResourceParameter.GitRepositoryId,
    'gitRepositoryId'
  )
  async deleteGitRepository(
    @Args() args: DeleteGitRepositoryArgs
  ): Promise<boolean> {
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

  //#endregion
  //#region Query
  @Query(() => [GitRepo])
  @AuthorizeContext(
    AuthorizableResourceParameter.GitOrganizationId,
    'gitOrganizationId'
  )
  async getReposOfOrganization(
    @Args() args: GetReposListArgs
  ): Promise<GitRepo[]> {
    return this.gitService.getReposOfOrganization(args);
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
  //#endregion
}
