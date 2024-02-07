import { EnumEventType } from "./segmentAnalyticsEvents.types";

export { EnumEventType } from "./segmentAnalyticsEvents.types";

export type IdentifyData = {
  accountId: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
};

export interface TrackData {
  accountId?: string;
  event: EnumEventType;
  properties?:
    | {
        [key: string]: unknown;
      }
    | undefined;
  context?: {
    traits?: IdentifyData;
    amplication?: {
      analyticsSessionId?: string;
    };
  };
}

export interface KnownUserTrackData {
  userId: string;
}
export interface AnonymousTrackData {
  anonymousId: string;
}
