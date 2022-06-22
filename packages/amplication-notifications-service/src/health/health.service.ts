import { Injectable } from '@nestjs/common';
import {
  HealthCheckService,
  MicroserviceHealthIndicator,
} from '@nestjs/terminus';
import { Transport } from '@nestjs/microservices';

@Injectable()
export class HealthService {
  constructor(
    private health: HealthCheckService,
    private microservice: MicroserviceHealthIndicator
  ) {}

  async isHealthy(): Promise<void> {
    this.health.check([
      async () =>
        this.microservice.pingCheck('kafka', {
          transport: Transport.KAFKA,
          options: { host: 'localhost', port: 9092 },
        }),
    ]);
  }
}
