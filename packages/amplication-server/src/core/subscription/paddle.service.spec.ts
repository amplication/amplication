import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { PaddleService, ERR_BAD_SIGNATURE } from './paddle.service';
import { SubscriptionService } from './subscription.service';
import { PaddleCreateSubscriptionEvent } from './dto/PaddleCreateSubscriptionEvent';
import { Subscription } from './dto/Subscription';
import { EnumPaddleSubscriptionStatus } from './dto/SubscriptionData';

/* eslint-disable @typescript-eslint/naming-convention*/
const PADDLE_CREATE_EVENT: PaddleCreateSubscriptionEvent = {
  alert_id: '101712024',
  alert_name: 'subscription_created',
  cancel_url:
    'https://checkout.paddle.com/subscription/cancel?user=3&subscription=3&hash=2af27b46e1685c8502cebd06c69155518e41c662',
  checkout_id: '5-942b025bda4167d-595bc41aba',
  currency: 'USD',
  email: 'yhill@example.net',
  event_time: '2021-07-13 06:20:46',
  linked_subscriptions: '6, 2, 8',
  marketing_consent: '',
  next_bill_date: '2021-07-25',
  passthrough: '{\\"workspaceId\\": \\"exampleWorkspaceId\\"}',
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
    'i3AtRZo0rcusGooQprhhm5eNhAfBwRKlmcw+R8aP/aO5HBnVJ/IENIDSmKQexXdMzFbs3FqVweYBh+SDXMgvH1fbI60O1CNzHGQNOktOY6AM0ZwxeD44uB95UICgC6jHu8WwAiJYTYKBkIcP8oOb9IPjn9Xv51g30mftIa3Jnn1W5nlDeeUc+OMwdZ9JVA+OuCrUKhp5Z/5JbDDfACofVbx59WoxNQSjEQ45E0imx44BS/9uh4A5/QUH0UxQcXmGVxicPqnoLj+8li6n1nsvacmHvmJavZqBT8Yf/zv2m2BaaaWruDoonLopxCSVooHI4/FP8JHXkVaMFAVcSNuO4OLsVPMbWB+KZ5COwLbltrZ2aQHtRwYrudK0yuExpEQfM3z2rIciMaCqmiP2Veh5kvdjYDpj8b/Yppa1HqfwtRpN8HPurG6HgCWN2kvTJWhRrnEDuGRuzXG6oWL6Q5Z2BQ/78sWW5rONTww0ouKqrABd5CssL9Lv8z8vMvy3tQEN8cVhUjGzG/StirSPXYJscLIvRLLWuoBO8Evxh5XF5Ybi5MUQS4aiwJzAcLcq3nifwJJ4lDiE7kcXw1A57CSZ255bIf0zztrjUfrD+5yOBx/76lHP2TujGaQcfkfAM5RFzCPlHM05CL35Ut8ps49Be81SYjidRfqX46rZ6bSOYFA='
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
    paddleCancelUrl: PADDLE_CREATE_EVENT.cancel_url
  },
  updatedAt: new Date()
};

const EXAMPLE_PADDLE_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAuauiaSn0a6MJieg0WFb4
5cM8J8eKXTf7FtZ4Uo7bq9krZoUZclPcDo+Ez19z66twK5yzCvtiS4bepzR5eJFj
YMiFeaBWKrENntCrL59m3amDeWL8HxMIBDq+uGm61tL0NsrQQzz+6Itppv/AJfAG
em53e8He/KP5MYhPkEQrPKyOmxAPusv69pz8UpqFofdOP93N7kAZ3rgioRhsRjze
xtMA3H7QxrTD1tPcEdoCBd5hmErwu98/V8ShfjQJZR/5LCjC1t3Fc5UCzGvgen4p
38NyolgwMS51cytMfpKjahV6QNsvOK9bCEKdPtk6GnEumj2jOkF/XcWFdjrfdlxS
1pVSYT13ORVSALv1pz2ActTeVadwUwWx/kGAizgvo4v/ZOU1Edjsmws4dFxaJbJE
LOqDmJCnQPRFOKARz8YSCtQe4go6URaJfYv/oYqHHJIRAoFGHo+8ehIJFsk1p9ui
/79p4ia5/8bxIv0yBWT8KJYzEsnasG3JhHr9RGRN07nPOk0zOtCGzS3AQoO8o5pQ
E/ojJ9zix2R5hLVYhCGhG5qMwi70iDa4g5ytCS4OkIvkzaSt/yhq7hL4CorT9UiP
EIWgAhEPJldEUSHLFAcEg5IP2j3xozcEcyF9lDpU4lw2FvScF9u2Y3vLScwtDz5H
cTUD7KNcecgRaQ1m1tRAwV8CAwEAAQ==
-----END PUBLIC KEY-----`;

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
