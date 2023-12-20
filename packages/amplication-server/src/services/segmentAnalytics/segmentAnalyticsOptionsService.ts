import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  SegmentAnalyticsOptionsFactory,
  SegmentAnalyticsOptions,
} from "./segmentAnalytics.interfaces";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";

export const SEGMENT_WRITE_KEY_SECRET_VAR = "SEGMENT_WRITE_KEY_SECRET";
export const MISSING_SEGMENT_WRITE_KEY_SECRET_ERROR = `Must provide ${SEGMENT_WRITE_KEY_SECRET_VAR}`;

@Injectable()
export class SegmentAnalyticsOptionsService
  implements SegmentAnalyticsOptionsFactory
{
  constructor(
    private readonly configService: ConfigService,
    @Inject(AmplicationLogger) private readonly logger: AmplicationLogger
  ) {}

  async createSegmentAnalyticsOptions(): Promise<SegmentAnalyticsOptions> {
    return {
      segmentWriteKey: await this.getSecret(),
    };
  }

  private async getSecret(): Promise<string> {
    const clientSecret = this.configService.get(SEGMENT_WRITE_KEY_SECRET_VAR);
    if (!clientSecret) {
      this.logger.error(MISSING_SEGMENT_WRITE_KEY_SECRET_ERROR);
      return "";
    }
    return clientSecret;
  }
}
