import { EnumEventType } from "./segmentAnalyticsEventType.types";

export { EnumEventType } from "./segmentAnalyticsEventType.types";

export type IdentifyData = {
  accountId?: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
};

/**
 * @deprecated Use `EventTrackData` for `trackWithContext` or `trackManual` instead
 */
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

export interface EventTrackData {
  event: EnumEventType;
  properties?:
    | {
        projectId?: string | undefined;
        resourceId?: string | undefined;
        [key: string]: unknown;
      }
    | undefined;
  context?: {
    traits?: IdentifyData;
  };
}

export interface ContextEventProperties {
  workspaceId?: string;
  $groups?: {
    /**
     * The workspace id
     */
    groupWorkspace: string;
  };
  projectId?: string;
  resourceId?: string;
}
