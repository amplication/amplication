import { QueueService } from "../queue/queue.service";
import { StorageService } from "../storage/storage.service";
import { HealthServiceBase } from "./base/health.service.base";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Injectable, Inject } from "@nestjs/common";
import os from "os";

@Injectable()
export class HealthService extends HealthServiceBase {
  constructor(
    private queueService: QueueService,
    private storageService: StorageService,
    @Inject(AmplicationLogger) private logger: AmplicationLogger
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
