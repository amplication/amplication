import { SegmentAnalyticsService } from "../segmentAnalytics.service";

// eslint-disable-next-line @typescript-eslint/naming-convention
export const MockedSegmentAnalyticsProvider = (
  {
    identifyMock = jest.fn(),
    trackWithContextMock = jest.fn(),
    trackManualMock = jest.fn(),
  } = {
    identifyMock: jest.fn(),
    trackWithContextMock: jest.fn(),
    trackManualMock: jest.fn(),
  }
) => {
  return {
    provide: SegmentAnalyticsService,
    useClass: jest.fn(() => ({
      identify: identifyMock,
      trackWithContext: trackWithContextMock,
      trackManual: trackManualMock,
    })),
  };
};
