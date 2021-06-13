import { Injectable, Inject } from '@nestjs/common';
import Analytics from 'analytics-node';
import { SegmentAnalyticsOptions } from './segmentAnalytics.interfaces';

export type IdentifyData = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
};

@Injectable()
export class SegmentAnalyticsService {
  private analytics: Analytics;

  constructor(
    @Inject('SEGMENT_ANALYTICS_OPTIONS')
    private options: SegmentAnalyticsOptions
  ) {
    this.analytics = new Analytics(this.options.segmentWriteKey);
  }

  public async identify(data: IdentifyData): Promise<void> {
    const { userId, ...rest } = data;

    this.analytics.identify({
      userId: userId,
      traits: rest
    });
  }
}
