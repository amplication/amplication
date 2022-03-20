import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import * as nestAccessControl from "nest-access-control";
import { GitHubRepositoryService } from "./gitHubRepository.service";
import { GitHubRepositoryControllerBase } from "./base/gitHubRepository.controller.base";

@swagger.ApiTags("gitHubRepositories")
@common.Controller("gitHubRepositories")
export class GitHubRepositoryController extends GitHubRepositoryControllerBase {
  constructor(
    protected readonly service: GitHubRepositoryService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {
    super(service, rolesBuilder);
  }
}
