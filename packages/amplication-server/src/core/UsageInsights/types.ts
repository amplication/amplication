import { EnumBlockType } from "../../enums/EnumBlockType";

export type BaseUsageInsightsArgs = {
  workspaceId: string;
  startDate: Date;
  endDate: Date;
  projectId?: string;
  resourceId?: string;
};

export type BlockChangesArgs = BaseUsageInsightsArgs & {
  blockType: EnumBlockType;
};

export type ParsedQueryRowResult = {
  year: string;
  timeGroup: string;
  count: number;
};

export type QueryRawResult = {
  year: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  time_group: number;
  count: bigint;
};
