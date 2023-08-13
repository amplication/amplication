import { EnvironmentVariables } from "@amplication/util/kafka";
import { Controller, Inject } from "@nestjs/common";
import { EventPattern, Payload } from "@nestjs/microservices";
import { plainToInstance } from "class-transformer";
import { Env } from "../../env";
import { ActionService } from "../action/action.service";
import { UserActionLog } from "@amplication/schema-registry";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";

@Controller("action")
export class UserActionController {
  constructor(
    private readonly actionService: ActionService,
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger
  ) {}

  @EventPattern(
    EnvironmentVariables.instance.get(Env.USER_ACTION_LOG_TOPIC, true)
  )
  async onUserActionLog(
    @Payload() message: UserActionLog.Value
  ): Promise<void> {
    try {
      const logEntry = plainToInstance(UserActionLog.Value, message);
      await this.actionService.onUserActionLog(logEntry);
    } catch (error) {
      this.logger.error(error.message, error);
    }
  }
}
