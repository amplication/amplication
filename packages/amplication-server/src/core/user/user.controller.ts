import { Controller, Inject, Param, Post } from "@nestjs/common";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { UserService } from "./user.service";
import { ApiTags } from "@nestjs/swagger";
import { ConfigService } from "@nestjs/config";

@ApiTags("user")
@Controller("announce-new-feature")
export class UserController {
  constructor(
    private readonly userService: UserService,
    private configService: ConfigService,

    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger
  ) {}

  @Post(`notifyUseFeatureAnnouncement/:token`)
  async notifyUseFeatureAnnouncement(
    @Param("token") token: string,
    @Param("user_active_days") userActiveDaysBack: number,
    @Param("notification_identifier") notificationId: string
  ): Promise<boolean> {
    this.logger.info(
      "notifyUseFeatureAnnouncement",
      userActiveDaysBack,
      notificationId
    );
    if (
      this.configService.get<string>(
        "FEATURE_ANNOUNCEMENT_NOTIFICATION_TOKEN"
      ) !== token
    ) {
      this.logger.error("InvalidToken, process aborted");
      return false;
    }
    return this.userService.notifyUserFeatureAnnouncement(
      userActiveDaysBack,
      notificationId
    );
  }
}
