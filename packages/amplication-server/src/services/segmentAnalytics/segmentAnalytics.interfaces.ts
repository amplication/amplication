import { ModuleMetadata, Type } from "@nestjs/common";

export interface SegmentAnalyticsOptions {
  segmentWriteKey: string;
}

export interface SegmentAnalyticsOptionsFactory {
  createSegmentAnalyticsOptions():
    | Promise<SegmentAnalyticsOptions>
    | SegmentAnalyticsOptions;
}

export interface SegmentAnalyticsAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  inject?: any[];
  useExisting?: Type<SegmentAnalyticsOptionsFactory>;
  useClass?: Type<SegmentAnalyticsOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<SegmentAnalyticsOptions> | SegmentAnalyticsOptions;
}
