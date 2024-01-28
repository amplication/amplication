import { Controller, Inject, Param, Post } from "@nestjs/common";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { WorkspaceService } from "./workspace.service";
import { ApiTags } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";

@ApiTags("workspace")
@Controller("migrate-custom-actions")
export class WorkspaceController {
  constructor(
    private readonly workspaceService: WorkspaceService,
    private configService: ConfigService,

    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger
  ) {}

  @Post(`createWorkspacesResourcesDefaultCustomActionsMigration/:token`)
  async createWorkspacesResourcesDefaultCustomActionsMigration(
    @Param("token") token: string,
    @Param("quantity") quantity: number
  ): Promise<boolean> {
    this.logger.info(
      "createWorkspacesResourcesDefaultCustomActionsMigration...."
    );
    if (
      this.configService.get<string>("CUSTOM_ACTION_MIGRATION_TOKEN") !== token
    ) {
      this.logger.error("InvalidToken, process aborted");
      return;
    }
    return this.workspaceService.dataMigrateWorkspacesResourcesCustomActions(
      quantity
    );
  }

  @Post(`createWorkspacesResourcesDefaultCustomActionsMigrationFix/:token`)
  async createWorkspacesResourcesDefaultCustomActionsMigrationFix(
    @Param("token") token: string,
    @Param("quantity") quantity: number
  ): Promise<boolean> {
    this.logger.info(
      "createWorkspacesResourcesDefaultCustomActionsMigrationFix...."
    );
    if (
      this.configService.get<string>("CUSTOM_ACTION_MIGRATION_TOKEN") !== token
    ) {
      this.logger.error("InvalidToken, process aborted");
      return;
    }
    return this.workspaceService.dataMigrateWorkspacesResourcesCustomActionsFix(
      quantity
    );
  }
}
