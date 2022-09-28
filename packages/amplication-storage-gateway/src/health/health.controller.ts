import {Controller, Inject} from "@nestjs/common";
import { HealthControllerBase } from "./base/health.controller.base";
import { HealthService } from "./health.service";
import {AMPLICATION_LOGGER_PROVIDER, AmplicationLogger} from "@amplication/nest-logger-module";

@Controller("_health")
export class HealthController extends HealthControllerBase {
  constructor(
    protected readonly healthService: HealthService,
    @Inject(AMPLICATION_LOGGER_PROVIDER) private logger: AmplicationLogger
  ) {
    super(healthService, logger);
  }
}
