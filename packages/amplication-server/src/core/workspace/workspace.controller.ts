import { Controller, Inject, Post } from "@nestjs/common";

import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { WorkspaceService } from "./workspace.service";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("workspace")
@Controller("migrate-custom-actions")
export class WorkspaceController {
  constructor(
    private readonly workspaceService: WorkspaceService,

    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger
  ) {}

  @Post("createWorkspacesResourcesDefaultCustomActionsMigration")
  async createWorkspacesResourcesDefaultCustomActionsMigration(
    token: string
  ): Promise<boolean> {
    console.log("createWorkspacesResourcesDefaultCustomActionsMigration....");
    return this.workspaceService.dataMigrateWorkspacesResourcesCustomActions();
  }
}
