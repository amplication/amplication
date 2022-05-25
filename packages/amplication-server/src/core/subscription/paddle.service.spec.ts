import {
  EnumSubscriptionPlan,
  EnumSubscriptionStatus
} from '@amplication/prisma-db';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PaddleCreateSubscriptionEvent } from './dto/PaddleCreateSubscriptionEvent';
import { Subscription } from './dto/Subscription';
import { EnumPaddleSubscriptionStatus } from './dto/SubscriptionData';
import { ERR_BAD_SIGNATURE, PaddleService } from './paddle.service';
import { SubscriptionService } from './subscription.service';

/* eslint-disable @typescript-eslint/naming-convention*/
const PADDLE_CREATE_EVENT: PaddleCreateSubscriptionEvent = {
  alert_id: '1237350276',
  alert_name: 'subscription_created',
  cancel_url:
    'https://checkout.paddle.com/subscription/cancel?user=3&subscription=3&hash=2af27b46e1685c8502cebd06c69155518e41c662',
  checkout_id: '5-942b025bda4167d-595bc41aba',
  currency: 'USD',
  email: 'yhill@example.net',
  event_time: '2021-07-13 08:11:46',
  linked_subscriptions: '6, 2, 8',
  marketing_consent: '',
  next_bill_date: '2021-07-25',
  passthrough: '{"workspaceId": "exampleWorkspaceId"}',
  quantity: '7',
  source: 'Order',
  status: 'trialing',
  subscription_id: '7',
  subscription_plan_id: '658632',
  unit_price: 'unit_price',
  update_url:
    'https://checkout.paddle.com/subscription/update?user=6&subscription=4&hash=57af6e8564b2899080cd34e0e3d16a3430eb61d9',
  user_id: '9',
  p_signature:
    'nu4HyEzJD/USnDJton8USCVir4xRA/MwixrVcCgTzdbr4NERJWOSo0ui7EKTeYEEXOkYO7ZBwumfGCdsW9fttkPOlhWnnaqIBiEeag/0tR4omQlxOFedaBzaLFwFH3wwKd9ZfxwuOT4Bgd4SI1oVdZUuGlRRCneb/LOEr5rkRdo5vWvs3fOJmHGmVRlLv8AXVHXuuA2oicUTSLKcmbz2J/E1y+8EBTXYuwt+boT14/J1iHzcJN6cMCr8eaPab01f6N/OhCpjfgrHe8kT6weVFTiew4H2bF5YPH341A8KISZRd0GNt+cqogo5ugBQ/Ek/Tybl1wm4kgdjGhx75tqSYc/7Y/YzDa6lkvYUIFFA0mqvKpqVUWii9dnpTNId6VAbcjBhkhjSWbxsbM2nyhafjFgkFmx8AL0J4v+xhFuMLygI0O/DfnK5/4LEc+3OquYXzHkTT7K6IxUCTHRyZIhGAizldhFup8BkOJO52leoCHyDEJTrupo9r174PijARpIZn/pSdW6p9/0d6xr9e6WYIOQl6YwjEVG0wUeY8dHc0SxMipURm1Ty5THfrstJowbCSByVgGhvP/NsHDv/nLL/NpDIvZzawQWz6KFlHCn8WOTkky8s3nGWgebrY6ip0xGbvpnDWYE3edLb1aSvEJqO/uF96LJXECRaN/Fum9w7An4='
};
/* eslint-enable */

const EXAMPLE_SUBSCRIPTION: Subscription = {
  id: 'ExampleSubscriptionId',
  createdAt: new Date(),
  subscriptionData: {
    paddleEmail: PADDLE_CREATE_EVENT.email,
    paddleUserId: PADDLE_CREATE_EVENT.user_id,
    paddleSubscriptionId: PADDLE_CREATE_EVENT.subscription_id,
    paddleSubscriptionPlanId: PADDLE_CREATE_EVENT.subscription_plan_id,
    paddleSubscriptionStatus: EnumPaddleSubscriptionStatus.Trailing,
    paddleNextBillDate: new Date(PADDLE_CREATE_EVENT.next_bill_date),
    paddleCancellationEffectiveDate: null,
    paddlePausedFrom: null,
    paddleUpdateUrl: PADDLE_CREATE_EVENT.update_url,
    paddleCancelUrl: PADDLE_CREATE_EVENT.cancel_url,
    paddleUnitPrice: +PADDLE_CREATE_EVENT.unit_price
  },
  subscriptionPlan: EnumSubscriptionPlan.Business,
  status: EnumSubscriptionStatus.Active,
  updatedAt: new Date(),
  workspaceId: 'ExampleWorkspaceId'
};

const EXAMPLE_PADDLE_PUBLIC_KEY =
  'LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUlJQ0lqQU5CZ2txaGtpRzl3MEJBUUVGQUFPQ0FnOEFNSUlDQ2dLQ0FnRUF1YXVpYVNuMGE2TUppZWcwV0ZiNAo1Y004SjhlS1hUZjdGdFo0VW83YnE5a3Jab1VaY2xQY0RvK0V6MTl6NjZ0d0s1eXpDdnRpUzRiZXB6UjVlSkZqCllNaUZlYUJXS3JFTm50Q3JMNTltM2FtRGVXTDhIeE1JQkRxK3VHbTYxdEwwTnNyUVF6eis2SXRwcHYvQUpmQUcKZW01M2U4SGUvS1A1TVloUGtFUXJQS3lPbXhBUHVzdjY5cHo4VXBxRm9mZE9QOTNON2tBWjNyZ2lvUmhzUmp6ZQp4dE1BM0g3UXhyVEQxdFBjRWRvQ0JkNWhtRXJ3dTk4L1Y4U2hmalFKWlIvNUxDakMxdDNGYzVVQ3pHdmdlbjRwCjM4TnlvbGd3TVM1MWN5dE1mcEtqYWhWNlFOc3ZPSzliQ0VLZFB0azZHbkV1bWoyak9rRi9YY1dGZGpyZmRseFMKMXBWU1lUMTNPUlZTQUx2MXB6MkFjdFRlVmFkd1V3V3gva0dBaXpndm80di9aT1UxRWRqc213czRkRnhhSmJKRQpMT3FEbUpDblFQUkZPS0FSejhZU0N0UWU0Z282VVJhSmZZdi9vWXFISEpJUkFvRkdIbys4ZWhJSkZzazFwOXVpCi83OXA0aWE1LzhieEl2MHlCV1Q4S0pZekVzbmFzRzNKaEhyOVJHUk4wN25QT2swek90Q0d6UzNBUW9POG81cFEKRS9vako5eml4MlI1aExWWWhDR2hHNXFNd2k3MGlEYTRnNXl0Q1M0T2tJdmt6YVN0L3locTdoTDRDb3JUOVVpUApFSVdnQWhFUEpsZEVVU0hMRkFjRWc1SVAyajN4b3pjRWN5RjlsRHBVNGx3MkZ2U2NGOXUyWTN2TFNjd3REejVICmNUVUQ3S05jZWNnUmFRMW0xdFJBd1Y4Q0F3RUFBUT09Ci0tLS0tRU5EIFBVQkxJQyBLRVktLS0tLQ==';

const subscriptionCreateSubscriptionMock = jest.fn(() => EXAMPLE_SUBSCRIPTION);
const configServiceGetMock = jest.fn(() => EXAMPLE_PADDLE_PUBLIC_KEY);

describe('PaddleService', () => {
  let service: PaddleService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: SubscriptionService,
          useValue: {
            createSubscription: subscriptionCreateSubscriptionMock
          }
        },
        {
          provide: ConfigService,
          useClass: jest.fn(() => ({
            get: configServiceGetMock
          }))
        },
        PaddleService
      ]
    }).compile();

    service = module.get<PaddleService>(PaddleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fail to validate bad signatures', async () => {
    await expect(
      service.handlePaddleWebhook({
        ...PADDLE_CREATE_EVENT,
        /* eslint-disable-next-line @typescript-eslint/naming-convention*/
        p_signature: '123'
      })
    ).rejects.toThrow(new Error(ERR_BAD_SIGNATURE));
  });

  it('should handle "create subscription" event', async () => {
    expect(await service.handlePaddleWebhook(PADDLE_CREATE_EVENT)).toEqual(
      EXAMPLE_SUBSCRIPTION
    );
    expect(subscriptionCreateSubscriptionMock).toBeCalledTimes(1);
    //expect(subscriptionCreateSubscriptionMock).toBeCalledWith({args});
  });
});
