import { PrismaService, Account } from "../../prisma";
import { Test, TestingModule } from "@nestjs/testing";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import { AccountService } from "./account.service";
import { EnumPreviewAccountType } from "../auth/dto/EnumPreviewAccountType";
import { IdentityProvider } from "../auth/auth.types";

const EXAMPLE_ACCOUNT_ID = "ExampleAccountId",
  EXAMPLE_EMAIL = "example@email.com",
  EXAMPLE_FIRST_NAME = "John",
  EXAMPLE_LAST_NAME = "Doe",
  EXAMPLE_PASSWORD = "Password",
  EXAMPLE_CURRENT_USER_ID = "ExampleUserId";

const EXAMPLE_ACCOUNT: Account = {
  id: EXAMPLE_ACCOUNT_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  email: EXAMPLE_EMAIL,
  firstName: EXAMPLE_FIRST_NAME,
  lastName: EXAMPLE_LAST_NAME,
  password: EXAMPLE_PASSWORD,
  currentUserId: EXAMPLE_CURRENT_USER_ID,
  githubId: null,
  previewAccountType: EnumPreviewAccountType.None,
  previewAccountEmail: null,
};

const segmentAnalyticsIdentifyMock = jest.fn(() => {
  return;
});
const segmentAnalyticsTrackMock = jest.fn(() => {
  return;
});

const prismaAccountCreateMock = jest.fn(() => {
  return EXAMPLE_ACCOUNT;
});

const prismaAccountFindOneMock = jest.fn(() => {
  return EXAMPLE_ACCOUNT;
});

const prismaAccountUpdateMock = jest.fn(() => {
  return EXAMPLE_ACCOUNT;
});

describe("AccountService", () => {
  let service: AccountService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: SegmentAnalyticsService,
          useClass: jest.fn(() => ({
            identify: segmentAnalyticsIdentifyMock,
            track: segmentAnalyticsTrackMock,
          })),
        },
        AccountService,
        {
          provide: PrismaService,
          useClass: jest.fn(() => ({
            account: {
              create: prismaAccountCreateMock,
              findUnique: prismaAccountFindOneMock,
              update: prismaAccountUpdateMock,
            },
          })),
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create an account", async () => {
    const args = {
      data: {
        email: EXAMPLE_EMAIL,
        firstName: EXAMPLE_FIRST_NAME,
        lastName: EXAMPLE_LAST_NAME,
        password: EXAMPLE_PASSWORD,
      },
    };
    expect(await service.createAccount(args, IdentityProvider.Local)).toEqual(
      EXAMPLE_ACCOUNT
    );
    expect(prismaAccountCreateMock).toBeCalledTimes(1);
    expect(prismaAccountCreateMock).toBeCalledWith(args);
    expect(segmentAnalyticsIdentifyMock).toBeCalledTimes(1);
    expect(segmentAnalyticsTrackMock).toBeCalledTimes(1);
    expect(segmentAnalyticsIdentifyMock).toBeCalledWith({
      userId: EXAMPLE_ACCOUNT_ID,
      createdAt: expect.any(Date),
      email: EXAMPLE_EMAIL,
      firstName: EXAMPLE_FIRST_NAME,
      lastName: EXAMPLE_LAST_NAME,
    });
  });

  it("should find one account", () => {
    const args = {
      where: {
        id: EXAMPLE_ACCOUNT_ID,
        email: EXAMPLE_EMAIL,
      },
    };
    expect(service.findAccount(args)).toEqual(EXAMPLE_ACCOUNT);
    expect(prismaAccountFindOneMock).toBeCalledTimes(1);
    expect(prismaAccountFindOneMock).toBeCalledWith(args);
  });

  it("should update an account", () => {
    const args = {
      where: { id: EXAMPLE_ACCOUNT_ID },
      data: {
        firstName: EXAMPLE_FIRST_NAME,
        lastName: EXAMPLE_LAST_NAME,
      },
    };
    expect(service.updateAccount(args)).toEqual(EXAMPLE_ACCOUNT);
    expect(prismaAccountUpdateMock).toBeCalledTimes(1);
    expect(prismaAccountUpdateMock).toBeCalledWith(args);
  });

  it("should set the current user", () => {
    const args = {
      accountId: EXAMPLE_ACCOUNT_ID,
      userId: EXAMPLE_CURRENT_USER_ID,
    };
    const returnArgs = {
      data: {
        currentUser: {
          connect: {
            id: args.userId,
          },
        },
      },
      where: {
        id: args.accountId,
      },
    };
    expect(service.setCurrentUser(args.accountId, args.userId)).toEqual(
      EXAMPLE_ACCOUNT
    );
    expect(prismaAccountUpdateMock).toBeCalledTimes(1);
    expect(prismaAccountUpdateMock).toBeCalledWith(returnArgs);
  });

  it("should set a password", async () => {
    const args = {
      accountId: EXAMPLE_ACCOUNT_ID,
      password: EXAMPLE_PASSWORD,
    };
    const returnArgs = {
      data: {
        password: args.password,
      },
      where: { id: args.accountId },
    };
    expect(await service.setPassword(args.accountId, args.password)).toEqual(
      EXAMPLE_ACCOUNT
    );
    expect(prismaAccountUpdateMock).toBeCalledTimes(1);
    expect(prismaAccountUpdateMock).toBeCalledWith(returnArgs);
  });
});
