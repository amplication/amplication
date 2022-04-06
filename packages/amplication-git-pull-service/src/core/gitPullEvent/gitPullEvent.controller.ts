import * as common from "@nestjs/common";
import { GitPullEventService } from "./gitPullEvent.service";

@common.Controller("gitRepositoriesPull")
export class GitPullEventController {
  constructor(protected readonly service: GitPullEventService) {}
}
