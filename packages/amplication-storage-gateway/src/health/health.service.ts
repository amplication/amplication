import { Injectable } from "@nestjs/common";
import { HealthServiceBase } from "./base/health.service.base";
import { QueueService } from "../queue/queue.service";
import { StorageService } from "../storage/storage.service";
import { AmplicationLogger } from "@amplication/nest-logger-module";
import os from "os";

@Injectable()
export class HealthService extends HealthServiceBase {
  constructor(
    private queueService: QueueService,
    private storageService: StorageService,
    private logger: AmplicationLogger
  ) {
    super();
  }

  async check(): Promise<void> {
    this.logger.info("Health check - EFS mount", {
      host: os.hostname(),
    });
    await this.storageService.touch();
    this.logger.info("Health check - kafka connection", {
      host: os.hostname(),
    });
    await this.queueService.connected();
  }
}
