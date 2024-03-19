import { EnumBlockType } from "../../enums/EnumBlockType";

export type BaseUsageInsightsArgs = {
  startDate: Date;
  endDate: Date;
  projectIds: string[];
};

export type BlockChangesArgs = BaseUsageInsightsArgs & {
  blockType: EnumBlockType;
};

export type ParsedQueryRowResult = {
  year: number;
  month: string;
  timeGroup: string;
  count: number;
};

export type QueryRawResult = {
  year: number;
  month: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  time_group: number;
  count: bigint;
};
