export enum EnumTimeFrame {
  LastMonth = "LAST_MONTH",
  LastThreeMonths = "LAST_THREE_MONTHS",
  LastYear = "LAST_YEAR",
  Custom = "CUSTOM",
}

export type TimeFrame = {
  timeFrame: EnumTimeFrame;
  startDate?: Date;
  endDate?: Date;
};

export type ProjectBuildsArgs = {
  workspaceId: string;
  startDate: Date;
  endDate: Date;
  projectId?: string;
};
