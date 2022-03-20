import * as common from "@nestjs/common";
import * as graphql from "@nestjs/graphql";
import * as nestAccessControl from "nest-access-control";
import { GqlDefaultAuthGuard } from "../auth/gqlDefaultAuth.guard";
import * as gqlACGuard from "../auth/gqlAC.guard";
import { GitHubRepositoryResolverBase } from "./base/gitHubRepository.resolver.base";
import { GitHubRepository } from "./base/GitHubRepository";
import { GitHubRepositoryService } from "./gitHubRepository.service";

@graphql.Resolver(() => GitHubRepository)
@common.UseGuards(GqlDefaultAuthGuard, gqlACGuard.GqlACGuard)
export class GitHubRepositoryResolver extends GitHubRepositoryResolverBase {
  constructor(
    protected readonly service: GitHubRepositoryService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }
}
