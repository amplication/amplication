import { Injectable, Inject } from "@nestjs/common";
import { Analytics } from "@segment/analytics-node";
import { SegmentAnalyticsOptions } from "./segmentAnalytics.interfaces";
import { RequestContext } from "nestjs-request-context";
import {
  AnonymousTrackData,
  IdentifyData,
  KnownUserTrackData,
  TrackData,
} from "./segmentAnalytics.types";
import cuid from "cuid";
@Injectable()
export class SegmentAnalyticsService {
  private analytics: Analytics;

  constructor(
    @Inject("SEGMENT_ANALYTICS_OPTIONS")
    private options: SegmentAnalyticsOptions
  ) {
    if (options && options.segmentWriteKey && options.segmentWriteKey.length) {
      this.analytics = new Analytics({
        writeKey: options.segmentWriteKey,
      });
    }
  }

  private parseValidUnixTimestampOrUndefined(
    value: string
  ): string | undefined {
    const timestamp = parseInt(value, 10);

    // Check if the value is an integer and within a valid range for Unix timestamps
    if (!isNaN(timestamp) && Number.isInteger(timestamp) && timestamp >= 0) {
      return value;
    } else {
      return undefined;
    }
  }

  public async identify(data: IdentifyData): Promise<void> {
    if (!this.analytics) return;

    const { accountId, ...rest } = data;

    this.analytics.identify({
      userId: accountId,
      traits: rest,
    });
  }

  public async track(data: TrackData): Promise<void> {
    if (!this.analytics) return;

    if (!data.accountId) {
      return this.trackAnonymous(data);
    }

    const req = RequestContext?.currentContext?.req;
    const analyticsSessionId = this.parseValidUnixTimestampOrUndefined(
      req?.analyticsSessionId
    );

    this.analytics.track({
      ...data,
      userId: data.accountId,
      properties: {
        ...data.properties,
        source: "amplication-server",
      },
      context: {
        ...data.context,
        amplication: {
          analyticsSessionId: analyticsSessionId,
        },
      },
    });
  }

  public async trackAnonymous(data: TrackData): Promise<void> {
    if (!this.analytics) return;

    const req = RequestContext?.currentContext?.req;
    const analyticsSessionId = this.parseValidUnixTimestampOrUndefined(
      req?.analyticsSessionId
    );

    this.analytics.track({
      ...data,
      anonymousId: cuid(),
      properties: {
        ...data.properties,
        source: "amplication-server",
      },
      context: {
        ...data.context,
        amplication: {
          analyticsSessionId: analyticsSessionId,
        },
      },
    });
  }
}
