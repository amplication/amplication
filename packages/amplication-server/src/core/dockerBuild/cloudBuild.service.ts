import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { CloudBuildClient } from '@google-cloud/cloudbuild';

/** @todo move to separate module */
@Injectable()
export class CloudBuildService extends CloudBuildClient
  implements OnModuleInit, OnModuleDestroy {
  async onModuleInit(): Promise<void> {
    await this.initialize();
  }

  async onModuleDestroy(): Promise<void> {
    await this.close();
  }
}
