import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleSecretsManagerService } from 'src/services/googleSecretsManager.service';
import {
  SegmentAnalyticsOptionsFactory,
  SegmentAnalyticsOptions
} from './segmentAnalytics.interfaces';

export const SEGMENT_WRITE_KEY_SECRET_VAR = 'SEGMENT_WRITE_KEY_SECRET';
export const SEGMENT_WRITE_KEY_SECRET_NAME_VAR =
  'SEGMENT_WRITE_KEY_SECRET_NAME';
export const MISSING_SEGMENT_WRITE_KEY_SECRET_ERROR = `Must provide either ${SEGMENT_WRITE_KEY_SECRET_VAR} or ${SEGMENT_WRITE_KEY_SECRET_NAME_VAR}`;

@Injectable()
export class SegmentAnalyticsOptionsService
  implements SegmentAnalyticsOptionsFactory {
  constructor(
    private readonly configService: ConfigService,
    private readonly googleSecretManagerService: GoogleSecretsManagerService
  ) {}

  async createSegmentAnalyticsOptions(): Promise<SegmentAnalyticsOptions> {
    return {
      segmentWriteKey: await this.getSecret()
    };
  }

  private async getSecret(): Promise<string> {
    const clientSecret = this.configService.get(SEGMENT_WRITE_KEY_SECRET_VAR);
    if (clientSecret) {
      return clientSecret;
    }
    const secretName = this.configService.get(
      SEGMENT_WRITE_KEY_SECRET_NAME_VAR
    );
    if (!secretName) {
      throw new Error(MISSING_SEGMENT_WRITE_KEY_SECRET_ERROR);
    }
    return this.getSecretFromManager(secretName);
  }
  private async getSecretFromManager(name: string): Promise<string> {
    const secretManager = this.googleSecretManagerService;
    const [version] = await secretManager.accessSecretVersion({ name });
    return version.payload.data.toString();
  }
}
