import { Controller } from "@nestjs/common";
import { HealthControllerBase } from "./base/health.controller.base";
import { HealthService } from "./health.service";

@Controller("health")
export class HealthController extends HealthControllerBase {
  constructor(protected readonly healthService: HealthService) {
    super(healthService);
  }
}
