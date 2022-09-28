import { Controller } from "@nestjs/common";
import { HealthControllerBase } from "./base/health.controller.base";
import { HealthService } from "./health.service";
import {AmplicationLogger} from "@amplication/nest-logger-module";

@Controller("_health")
export class HealthController extends HealthControllerBase {
  constructor(protected readonly healthService: HealthService,
              protected logger: AmplicationLogger) {
    super(healthService, logger);
  }
}
