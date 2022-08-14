import { Module } from '@nestjs/common';
import { HubSpotAnalyticsService } from './hub-spot-analytics.service';

@Module({
  providers: [HubSpotAnalyticsService]
})
export class HubSpotAnalyticsModule {}
