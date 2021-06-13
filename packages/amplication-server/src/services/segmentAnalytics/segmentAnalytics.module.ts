import { Module, Global, DynamicModule, Provider } from '@nestjs/common';
import { SegmentAnalyticsService } from './segmentAnalytics.service';
import {
  SegmentAnalyticsAsyncOptions,
  SegmentAnalyticsOptionsFactory
} from './segmentAnalytics.interfaces';
import { GoogleSecretsManagerModule } from 'src/services/googleSecretsManager.module';

@Global()
@Module({})
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
      imports: [GoogleSecretsManagerModule],
      providers: [
        SegmentAnalyticsService,
        ...this.createConnectProviders(options)
      ],
      exports: [SegmentAnalyticsService]
    };
  }

  private static createConnectProviders(
    options: SegmentAnalyticsAsyncOptions
  ): Provider[] {
    return [
      {
        provide: 'SEGMENT_ANALYTICS_OPTIONS',
        useFactory: async (optionsFactory: SegmentAnalyticsOptionsFactory) =>
          await optionsFactory.createSegmentAnalyticsOptions(),
        inject: [options.useClass]
      },
      {
        provide: options.useClass,
        useClass: options.useClass
      }
    ];
  }
}
