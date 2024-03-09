import { EnumBlockType } from "../../enums/EnumBlockType";

export type BaseAnalyticsArgs = {
  workspaceId: string;
  startDate: Date;
  endDate: Date;
  projectId?: string;
  resourceId?: string;
};

export type BlockChangesArgs = BaseAnalyticsArgs & {
  blockType: keyof typeof EnumBlockType;
};
