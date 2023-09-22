import { UseFilters, UseGuards } from "@nestjs/common";
import { Args, Mutation, Query } from "@nestjs/graphql";
import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { InjectContextValue } from "../../decorators/injectContextValue.decorator";
import { FindOneArgs } from "../../dto";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { InjectableOriginParameter } from "../../enums/InjectableOriginParameter";
import { Resource } from "../../models/Resource";
import { GitOrganization } from "../../models/GitOrganization";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { AuthorizeResourceWithGitResult } from "../resource/dto/AuthorizeResourceWithGitResult";
import { ConnectGitRepositoryArgs } from "./dto/args/ConnectGitRepositoryArgs";
import { CreateGitOrganizationArgs } from "./dto/args/CreateGitOrganizationArgs";
import { CreateGitRepositoryArgs } from "./dto/args/CreateGitRepositoryArgs";
import { DeleteGitOrganizationArgs } from "./dto/args/DeleteGitOrganizationArgs";
import { DeleteGitRepositoryArgs } from "./dto/args/DeleteGitRepositoryArgs";
import { GetGitInstallationUrlArgs } from "./dto/args/GetGitInstallationUrlArgs";
import { RemoteGitRepositoriesFindManyArgs } from "./dto/args/RemoteGitRepositoriesFindManyArgs";
import { GitOrganizationFindManyArgs } from "./dto/args/GitOrganizationFindManyArgs";
import {
  RemoteGitRepos,
  RemoteGitRepository,
} from "./dto/objects/RemoteGitRepository";
import { GitProviderService } from "./git.provider.service";
import { DisconnectGitRepositoryArgs } from "./dto/args/DisconnectGitRepositoryArgs";
import { ConnectToProjectGitRepositoryArgs } from "./dto/args/ConnectToProjectGitRepositoryArgs";
import { CompleteGitOAuth2FlowArgs } from "./dto/args/CompleteGitOAuth2FlowArgs";
import { CreateGitRepositoryBaseArgs } from "./dto/args/CreateGitRepositoryBaseArgs";
import { GitGroupArgs } from "./dto/args/GitGroupArgs";
import { PaginatedGitGroup } from "./dto/objects/PaginatedGitGroup";
import { GitRepository, User } from "../../models";
import { UserEntity } from "../../decorators/user.decorator";
import { UpdateGitRepositoryArgs } from "./dto/args/UpdateGitRepositoryArgs";

@UseFilters(GqlResolverExceptionsFilter)
@UseGuards(GqlAuthGuard)
export class GitResolver {
  constructor(private readonly gitService: GitProviderService) {}
  @Mutation(() => Resource)
  @AuthorizeContext(
    AuthorizableOriginParameter.GitOrganizationId,
    "data.gitOrganizationId"
  )
  async connectGitRepository(
    @Args() args: CreateGitRepositoryArgs
  ): Promise<Resource | boolean> {
    return this.gitService.connectGitRepository(args.data);
  }

  @Mutation(() => RemoteGitRepository)
  @AuthorizeContext(
    AuthorizableOriginParameter.GitOrganizationId,
    "data.gitOrganizationId"
  )
  async createRemoteGitRepository(
    @Args() args: CreateGitRepositoryBaseArgs
  ): Promise<RemoteGitRepository> {
    return this.gitService.createRemoteGitRepository(args.data);
  }

  @Query(() => GitOrganization)
  @AuthorizeContext(AuthorizableOriginParameter.GitOrganizationId, "where.id")
  async gitOrganization(@Args() args: FindOneArgs): Promise<GitOrganization> {
    return this.gitService.getGitOrganization(args);
  }

  @Mutation(() => Resource)
  @AuthorizeContext(
    AuthorizableOriginParameter.GitOrganizationId,
    "data.gitOrganizationId"
  )
  async connectResourceGitRepository(
    @Args() args: ConnectGitRepositoryArgs
  ): Promise<Resource> {
    return await this.gitService.connectResourceGitRepository(args.data);
  }
  @Mutation(() => Resource)
  @AuthorizeContext(AuthorizableOriginParameter.ResourceId, "resourceId")
  async connectResourceToProjectRepository(
    @Args() args: ConnectToProjectGitRepositoryArgs
  ): Promise<Resource> {
    return await this.gitService.connectResourceToProjectRepository(
      args.resourceId
    );
  }

  @Mutation(() => GitOrganization, {})
  @InjectContextValue(InjectableOriginParameter.WorkspaceId, "data.workspaceId")
  async createOrganization(
    @UserEntity() currentUser: User,
    @Args()
    args: CreateGitOrganizationArgs
  ): Promise<GitOrganization> {
    return await this.gitService.createGitOrganization(args, currentUser);
  }

  @Mutation(() => Resource)
  @AuthorizeContext(
    AuthorizableOriginParameter.GitRepositoryId,
    "gitRepositoryId"
  )
  async deleteGitRepository(
    @Args() args: DeleteGitRepositoryArgs
  ): Promise<boolean> {
    return this.gitService.deleteGitRepository(args);
  }

  @Mutation(() => GitRepository)
  @AuthorizeContext(AuthorizableOriginParameter.GitRepositoryId, "where.id")
  async updateGitRepository(
    @Args() args: UpdateGitRepositoryArgs
  ): Promise<GitRepository> {
    return this.gitService.updateGitRepository(args);
  }

  @Mutation(() => Boolean)
  @AuthorizeContext(
    AuthorizableOriginParameter.GitOrganizationId,
    "gitOrganizationId"
  )
  async deleteGitOrganization(
    @Args() args: DeleteGitOrganizationArgs
  ): Promise<boolean> {
    return this.gitService.deleteGitOrganization(args);
  }

  @Mutation(() => Resource)
  @AuthorizeContext(AuthorizableOriginParameter.ResourceId, "resourceId")
  async disconnectResourceGitRepository(
    @Args() args: DisconnectGitRepositoryArgs
  ): Promise<Resource> {
    return this.gitService.disconnectResourceGitRepository(args.resourceId);
  }

  @Mutation(() => AuthorizeResourceWithGitResult)
  @InjectContextValue(InjectableOriginParameter.WorkspaceId, "data.workspaceId")
  async getGitResourceInstallationUrl(
    @Args() args: GetGitInstallationUrlArgs
  ): Promise<AuthorizeResourceWithGitResult> {
    return {
      url: await this.gitService.getGitInstallationUrl(args),
    };
  }

  @Mutation(() => GitOrganization)
  @InjectContextValue(InjectableOriginParameter.WorkspaceId, "data.workspaceId")
  async completeGitOAuth2Flow(
    @UserEntity() currentUser: User,
    @Args() args: CompleteGitOAuth2FlowArgs
  ): Promise<GitOrganization> {
    return await this.gitService.completeOAuth2Flow(args, currentUser);
  }

  @Query(() => PaginatedGitGroup)
  @AuthorizeContext(
    AuthorizableOriginParameter.GitOrganizationId,
    "where.organizationId"
  )
  gitGroups(@Args() args: GitGroupArgs): Promise<PaginatedGitGroup> {
    return this.gitService.getGitGroups(args);
  }

  @Query(() => RemoteGitRepos)
  @AuthorizeContext(
    AuthorizableOriginParameter.GitOrganizationId,
    "where.gitOrganizationId"
  )
  async remoteGitRepositories(
    @Args() args: RemoteGitRepositoriesFindManyArgs
  ): Promise<RemoteGitRepos> {
    return this.gitService.getReposOfOrganization(args.where);
  }

  @Query(() => [GitOrganization])
  @InjectContextValue(
    InjectableOriginParameter.WorkspaceId,
    "where.workspaceId"
  )
  async gitOrganizations(
    @Args() args: GitOrganizationFindManyArgs
  ): Promise<GitOrganization[]> {
    return this.gitService.getGitOrganizations(args);
  }
}
