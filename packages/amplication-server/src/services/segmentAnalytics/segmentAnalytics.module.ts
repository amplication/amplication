import {
  Module,
  Global,
  DynamicModule,
  Provider,
  forwardRef,
} from "@nestjs/common";
import { SegmentAnalyticsService } from "./segmentAnalytics.service";
import {
  SegmentAnalyticsAsyncOptions,
  SegmentAnalyticsOptionsFactory,
} from "./segmentAnalytics.interfaces";
import { PrismaModule } from "../../prisma";
import { BillingModule } from "../../core/billing/billing.module";

@Global()
@Module({
  imports: [PrismaModule],
})
export class SegmentAnalyticsModule {
  /**
   *  public static register( ... )
   *  omitted here for brevity
   */

  public static registerAsync(
    options: SegmentAnalyticsAsyncOptions
  ): DynamicModule {
    return {
      module: SegmentAnalyticsModule,
      imports: [forwardRef(() => BillingModule)],
      providers: [
        SegmentAnalyticsService,
        ...this.createConnectProviders(options),
      ],
      exports: [SegmentAnalyticsService],
    };
  }

  private static createConnectProviders(
    options: SegmentAnalyticsAsyncOptions
  ): Provider[] {
    return [
      {
        provide: "SEGMENT_ANALYTICS_OPTIONS",
        useFactory: async (optionsFactory: SegmentAnalyticsOptionsFactory) =>
          await optionsFactory.createSegmentAnalyticsOptions(),
        inject: [options.useClass],
      },
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }
}
