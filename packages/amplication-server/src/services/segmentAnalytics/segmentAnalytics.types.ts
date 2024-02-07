import { EnumEventType } from "./segmentAnalyticsEventType.types";

export { EnumEventType } from "./segmentAnalyticsEventType.types";

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
