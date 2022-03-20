import * as common from "@nestjs/common";
import { GitRepositoryPullService } from "./GitRepositoryPull.service";

@common.Controller("gitRepositoriesPull")
export class GitRepositoryPullController {
  constructor(protected readonly service: GitRepositoryPullService) {}
}
