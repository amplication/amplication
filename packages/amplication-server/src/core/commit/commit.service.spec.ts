import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "../../prisma/prisma.service";
import { Commit } from "../../models";
import { CommitService } from "./commit.service";
import { EntityService } from "../entity/entity.service";
import { BlockService } from "../block/block.service";
import { FindManyCommitArgs } from "./dto/FindManyCommitArgs";
import { EnumResourceTypeGroup } from "../resource/dto/EnumResourceTypeGroup";
import { RESOURCE_TYPE_GROUP_TO_RESOURCE_TYPE } from "../resource/constants";

const EXAMPLE_COMMIT_ID = "exampleCommitId";
const EXAMPLE_USER_ID = "exampleUserId";
const EXAMPLE_MESSAGE = "exampleMessage";

const EXAMPLE_COMMIT: Commit = {
  id: EXAMPLE_COMMIT_ID,
  userId: EXAMPLE_USER_ID,
  message: EXAMPLE_MESSAGE,
  createdAt: new Date(),
};

const prismaCommitFindOneMock = jest.fn(() => EXAMPLE_COMMIT);
const prismaCommitFindManyMock = jest.fn(() => [EXAMPLE_COMMIT]);

describe("CommitService", () => {
  let service: CommitService;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        {
          provide: PrismaService,
          useClass: jest.fn(() => ({
            commit: {
              findUnique: prismaCommitFindOneMock,
              findMany: prismaCommitFindManyMock,
            },
          })),
        },
        {
          provide: EntityService,
          useValue: {},
        },
        {
          provide: BlockService,
          useValue: {},
        },
        CommitService,
      ],
    }).compile();

    service = module.get<CommitService>(CommitService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should find one Commit", async () => {
    const args = { where: { id: EXAMPLE_COMMIT_ID } };
    expect(await service.findOne(args)).toEqual(EXAMPLE_COMMIT);
    expect(prismaCommitFindOneMock).toBeCalledTimes(1);
    expect(prismaCommitFindOneMock).toBeCalledWith(args);
  });

  it("should find many Commits", async () => {
    const resourceTypeGroup = EnumResourceTypeGroup.Services;

    const args: FindManyCommitArgs = {
      where: {
        resourceTypeGroup: EnumResourceTypeGroup.Services,
      },
    };
    const resourceTypes =
      RESOURCE_TYPE_GROUP_TO_RESOURCE_TYPE[resourceTypeGroup];

    expect(await service.findMany(args)).toEqual([EXAMPLE_COMMIT]);
    expect(prismaCommitFindManyMock).toBeCalledTimes(1);
    expect(prismaCommitFindManyMock).toBeCalledWith({
      ...args,
      include: {
        builds: {
          include: {
            action: {
              include: {
                steps: {
                  include: {
                    logs: true,
                  },
                },
              },
            },
            resource: true,
            createdBy: {
              include: {
                account: true,
              },
            },
          },
        },
        user: {
          include: {
            account: true,
          },
        },
      },
      where: {
        ...args.where,
        builds: {
          some: {
            resource: {
              resourceType: {
                in: resourceTypes,
              },
            },
          },
        },
      },
    });
  });
});
