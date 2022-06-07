import { Injectable, Inject } from '@nestjs/common';
import Analytics from 'analytics-node';
import { SegmentAnalyticsOptions } from './segmentAnalytics.interfaces';

export enum EnumEventType {
  Signup = 'Signup'
}

export type IdentifyData = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
};

export type TrackData = {
  userId: string;
  event: EnumEventType;
  properties?:
    | {
        [key: string]: unknown;
      }
    | undefined;
};

@Injectable()
export class SegmentAnalyticsService {
  private analytics: Analytics;

  constructor(
    @Inject('SEGMENT_ANALYTICS_OPTIONS')
    private options: SegmentAnalyticsOptions
  ) {
    if (options && options.segmentWriteKey && options.segmentWriteKey.length) {
      this.analytics = new Analytics(this.options.segmentWriteKey);
    }
  }

  public async identify(data: IdentifyData): Promise<void> {
    if (!this.analytics) return;

    const { userId, ...rest } = data;

    this.analytics.identify({
      userId: userId,
      traits: rest
    });
  }

  public async track(data: TrackData): Promise<void> {
    if (!this.analytics) return;
    this.analytics.track(data);
  }
}
