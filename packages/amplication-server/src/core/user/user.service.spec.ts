import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import { MockedAmplicationLoggerProvider } from "@amplication/util/nestjs/logging/test-utils";
import { ConfigService } from "@nestjs/config";
import { Test, TestingModule } from "@nestjs/testing";
import { Account, User } from "../../models";
import { PrismaService } from "../../prisma";
import { BillingService } from "../billing/billing.service";
import { UserService } from "./user.service";

const EXAMPLE_USER_ID = "exampleUserId";

const EXAMPLE_FIRST_NAME = "ExampleFirstName";
const EXAMPLE_LAST_NAME = "ExampleLastName";
const EXAMPLE_PASSWORD = "ExamplePassword";
const EXAMPLE_EMAIL = "email@example.com";
const EXAMPLE_ID = "ExampleId";

const EXAMPLE_ACCOUNT: Account = {
  id: EXAMPLE_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  email: EXAMPLE_EMAIL,
  firstName: EXAMPLE_FIRST_NAME,
  lastName: EXAMPLE_LAST_NAME,
  password: EXAMPLE_PASSWORD,
  githubId: null,
};

const EXAMPLE_USER: User = {
  id: EXAMPLE_USER_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  account: EXAMPLE_ACCOUNT,
  isOwner: true,
};

const prismaUserFindOneMock = jest.fn(() => ({
  then: (resolve) => resolve(EXAMPLE_USER),
  account: () => EXAMPLE_ACCOUNT,
}));

const prismaUserFindManyMock = jest.fn(() => {
  return [EXAMPLE_USER];
});

const prismaUserUpdateMock = jest.fn(() => {
  return EXAMPLE_USER;
});

describe("UserService", () => {
  let service: UserService;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: KafkaProducerService,
          useClass: jest.fn(),
        },
        {
          provide: ConfigService,
          useClass: jest.fn(() => ({
            get: jest.fn(),
          })),
        },
        UserService,
        {
          provide: PrismaService,
          useClass: jest.fn(() => ({
            user: {
              findUnique: prismaUserFindOneMock,
              findFirst: prismaUserFindOneMock,
              findMany: prismaUserFindManyMock,
              update: prismaUserUpdateMock,
            },
          })),
        },
        {
          provide: BillingService,
          useClass: jest.fn(),
        },

        MockedAmplicationLoggerProvider,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should find one", async () => {
    const args = { where: { id: EXAMPLE_USER_ID } };
    expect(await service.findUser(args)).toEqual(EXAMPLE_USER);
    expect(prismaUserFindOneMock).toBeCalledTimes(1);
    expect(prismaUserFindOneMock).toBeCalledWith({
      where: { ...args.where, deletedAt: null },
    });
  });

  it("should find one including deleted when requested", async () => {
    const args = { where: { id: EXAMPLE_USER_ID } };
    expect(await service.findUser(args, true)).toEqual(EXAMPLE_USER);
    expect(prismaUserFindOneMock).toBeCalledTimes(1);
    expect(prismaUserFindOneMock).toBeCalledWith({
      where: { ...args.where, deletedAt: undefined },
    });
  });

  it("should find many", async () => {
    const args = { where: { id: EXAMPLE_USER_ID } };
    expect(await service.findUsers(args)).toEqual([EXAMPLE_USER]);
    expect(prismaUserFindManyMock).toBeCalledTimes(1);
    expect(prismaUserFindManyMock).toBeCalledWith({
      where: { ...args.where, deletedAt: null },
    });
  });

  it("should delete a user", async () => {
    const args = { where: { id: EXAMPLE_USER_ID, deletedAt: null } };
    expect(await service.delete(EXAMPLE_USER_ID)).toEqual(EXAMPLE_USER);
    expect(prismaUserFindOneMock).toBeCalledTimes(1);
    expect(prismaUserFindOneMock).toBeCalledWith(args);
    expect(prismaUserUpdateMock).toBeCalledTimes(1);
    expect(prismaUserUpdateMock).toBeCalledWith({
      where: {
        id: EXAMPLE_USER_ID,
      },
      data: {
        deletedAt: expect.any(Date),
      },
    });
  });

  it("should set lastActive", async () => {
    const args = {
      userId: EXAMPLE_USER_ID,
      lastActive: new Date(),
    };
    const returnArgs = {
      data: {
        lastActive: args.lastActive,
      },
      where: { id: args.userId },
    };
    expect(await service.setLastActivity(args.userId, args.lastActive)).toEqual(
      EXAMPLE_USER
    );
    expect(prismaUserUpdateMock).toBeCalledTimes(1);
    expect(prismaUserUpdateMock).toBeCalledWith(returnArgs);
  });
});
