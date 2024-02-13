import { EnumEventType } from "./segmentAnalyticsEventType.types";

export { EnumEventType } from "./segmentAnalyticsEventType.types";

export type IdentifyData = {
  accountId?: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
};

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
