import { HealthControllerBase } from "./base/health.controller.base";
import { HealthService } from "./health.service";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Controller, Inject } from "@nestjs/common";

@Controller("_health")
export class HealthController extends HealthControllerBase {
  constructor(
    protected readonly healthService: HealthService,
    @Inject(AmplicationLogger) protected logger: AmplicationLogger
  ) {
    super(healthService, logger);
  }
}
