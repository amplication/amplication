import { HealthControllerBase } from './base/health.controller.base';
import { HealthService } from './health.service';
import { Controller } from '@nestjs/common';

@Controller('_health')
export class HealthController extends HealthControllerBase {
  constructor(protected readonly healthService: HealthService) {
    super(healthService);
  }
}
