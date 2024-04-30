import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Param,
  Post,
} from "@nestjs/common";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { WorkspaceService } from "./workspace.service";
import { ApiTags } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";
import {
  CreateWorkspacesResourcesDefaultCustomActionsMigrationInput,
  CreateWorkspacesResourcesDefaultCustomDtosMigrationInput,
} from "./dto/CreateWorkspacesResourcesDefaultCustomActionsMigrationInput";

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
    @Body()
    data: CreateWorkspacesResourcesDefaultCustomActionsMigrationInput
  ): Promise<boolean> {
    this.logger.info(
      "createWorkspacesResourcesDefaultCustomActionsMigration...."
    );
    const { quantity } = data;

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
    @Body()
    data: CreateWorkspacesResourcesDefaultCustomActionsMigrationInput
  ): Promise<boolean> {
    this.logger.info(
      "createWorkspacesResourcesDefaultCustomActionsMigrationFix...."
    );
    const { quantity } = data;

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

  @Post(`createWorkspacesResourcesDefaultCustomDtosMigration/:token`)
  async createWorkspacesResourcesDefaultCustomDtosMigration(
    @Param("token") token: string,
    @Body()
    data: CreateWorkspacesResourcesDefaultCustomDtosMigrationInput
  ): Promise<string> {
    this.logger.info("createWorkspacesResourcesDefaultCustomDtosMigration....");
    const { quantity, page } = data;

    if (
      this.configService.get<string>("CUSTOM_ACTION_MIGRATION_TOKEN") !== token
    ) {
      this.logger.error("InvalidToken, process aborted");
      throw new BadRequestException("InvalidToken, process aborted");
    }

    this.workspaceService
      .dataMigrateWorkspacesResourcesCustomDtos(quantity, page)
      .catch((error) => {
        this.logger.error(
          "Error in createWorkspacesResourcesDefaultCustomDtosMigration",
          error
        );
      });

    return "Check logs for more information";
  }
}
