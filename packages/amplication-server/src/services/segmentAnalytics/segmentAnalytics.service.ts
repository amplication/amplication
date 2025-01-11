import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Inject, Injectable } from "@nestjs/common";
import { Analytics, TrackParams } from "@segment/analytics-node";
import { RequestContext } from "nestjs-request-context";
import { Account, PrismaService, User } from "../../prisma";
import { SegmentAnalyticsOptions } from "./segmentAnalytics.interfaces";
import {
  ContextEventProperties,
  EventTrackData,
  IdentifyData,
} from "./segmentAnalytics.types";
@Injectable()
export class SegmentAnalyticsService {
  private analytics: Analytics;
  analyticsErrorMessage = "AnalyticsError: Failed to track event";

  constructor(
    @Inject("SEGMENT_ANALYTICS_OPTIONS")
    options: SegmentAnalyticsOptions,
    private readonly logger: AmplicationLogger,
    private readonly prismaService: PrismaService
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

    const req = RequestContext?.currentContext?.req;
    const analyticsSessionId = this.parseValidUnixTimestampOrUndefined(
      req?.analyticsSessionId
    );

    try {
      this.analytics.identify({
        userId: data.accountId,
        anonymousId: analyticsSessionId,
        traits: data,
      });
    } catch (error) {
      this.logger.error("Failed to track event", error, { data });
    }
  }

  private async getEventProperties(
    workspaceId: string,
    properties: EventTrackData["properties"]
  ): Promise<ContextEventProperties> {
    let projectId = properties?.projectId;
    const resourceId = properties?.resourceId;

    if (!projectId && resourceId) {
      const resource = await this.prismaService.resource.findUnique({
        where: {
          id: resourceId,
        },
        select: {
          projectId: true,
        },
      });
      projectId = resource?.projectId;
    }

    const eventProperties = {
      workspaceId,
      $groups: {
        groupWorkspace: workspaceId,
      },
      projectId,
      resourceId,
    };

    return eventProperties;
  }

  /**
   * Track an event for a user that is logged in
   * leveraging the current request context to get the user data
   * and the analytics session ID.
   * NOTE: Only for methods that are called within the context of a request
   * (NOT working for methods called from a Kafka event).
   * It automatically enriches the event with resource, project and workspace data.
   */
  public async trackWithContext(data: EventTrackData): Promise<void> {
    if (!this.analytics) return;

    try {
      const req = RequestContext?.currentContext?.req;
      const user: User & {
        account: Account;
      } = req?.user;
      const { accountId, workspaceId } = user;

      await this.trackManual({
        user: {
          accountId,
          workspaceId,
        },
        data,
      });
    } catch (error) {
      this.logger.error(this.analyticsErrorMessage, error, { data });
    }
  }

  /**
   * Track an event for a user that is not logged in.
   * NOTE: Methods that are called within the context of a request
   * should prefer using `trackWithContext` instead.
   * It automatically enriches the event with resource, project and workspace data.
   */
  public async trackManual({
    user,
    data,
  }: {
    /**
     * The user data to track the event for
     */
    user: Partial<Pick<User, "accountId" | "workspaceId">>;
    data: EventTrackData;
  }): Promise<void> {
    if (!this.analytics) return;

    const req = RequestContext?.currentContext?.req;
    const analyticsSessionId = this.parseValidUnixTimestampOrUndefined(
      req?.analyticsSessionId
    );

    try {
      const eventProperties = user?.workspaceId
        ? await this.getEventProperties(user?.workspaceId, data.properties)
        : {};

      const trackData: TrackParams = {
        event: data.event,
        userId: user?.accountId,
        // If the user is not logged in, use an anonymous ID from the client to track the event and merge the user on signup
        anonymousId: analyticsSessionId,
        properties: {
          ...eventProperties,
          ...data.properties,
          source: "amplication-server",
        },
        context: {
          ...data.context,
          amplication: {
            analyticsSessionId: analyticsSessionId,
          },
        },
      };

      this.analytics.track(trackData);
    } catch (error) {
      this.logger.error(this.analyticsErrorMessage, error, { data });
    }
  }
}
