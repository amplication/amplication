import * as common from "@nestjs/common";
import { GitRepositoryPullService } from "./gitRepositoryPull.service";

@common.Controller("gitRepositoriesPull")
export class GitRepositoryPullController {
  constructor(protected readonly service: GitRepositoryPullService) {}
}
