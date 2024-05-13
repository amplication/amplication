import { MeteredEntitlement } from "@stigg/node-server-sdk";

export const billingServiceIsBillingEnabledMock = jest.fn(() => true);

export const billingServiceMock = {
  getMeteredEntitlement: jest.fn(() => {
    return {
      usageLimit: undefined,
      hasAccess: true,
    } as unknown as MeteredEntitlement;
  }),
  getNumericEntitlement: jest.fn(() => {
    return {};
  }),
  reportUsage: jest.fn(() => {
    return {};
  }),
};
// This is important to mock the getter!!!
Object.defineProperty(billingServiceMock, "isBillingEnabled", {
  get: billingServiceIsBillingEnabledMock,
});
