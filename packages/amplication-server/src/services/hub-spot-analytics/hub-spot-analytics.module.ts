import { Module, DynamicModule } from '@nestjs/common';
import { HubSpotAnalyticsService } from './hub-spot-analytics.service';

@Module({
  providers: [HubSpotAnalyticsService],
  exports: [HubSpotAnalyticsService]
})
export class HubSpotAnalyticsModule {
  static forRoot(): DynamicModule {
    return {
      module: HubSpotAnalyticsModule,
      providers: [HubSpotAnalyticsService]
    };
  }
}
