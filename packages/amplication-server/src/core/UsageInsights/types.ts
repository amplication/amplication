import { EnumBlockType } from "../../enums/EnumBlockType";
import { EnumTimeGroup } from "./dtos/EnumTimeGroup";

export type BaseUsageInsightsArgs = {
  startDate: Date;
  endDate: Date;
  projectIds: string[];
  timeGroup?: EnumTimeGroup;
};

export type BlockChangesArgs = BaseUsageInsightsArgs & {
  blockType: EnumBlockType;
};

export type ParsedQueryRowResult = {
  year: number;
  month: number;
  timeGroup: number;
  count: number;
};

export type QueryRawResult = {
  year: number;
  month: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  time_group: number;
  count: bigint;
};
