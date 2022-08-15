import { Test, TestingModule } from '@nestjs/testing';
import { HubSpotAnalyticsService } from './hub-spot-analytics.service';

describe('HubSpotAnalyticsService', () => {
  let service: HubSpotAnalyticsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HubSpotAnalyticsService]
    }).compile();

    service = module.get<HubSpotAnalyticsService>(HubSpotAnalyticsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
