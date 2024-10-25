import { Test, TestingModule } from "@nestjs/testing";
import { Team, User, Workspace } from "../../models";
import { PrismaService } from "../../prisma/prisma.service";
import { MockedSegmentAnalyticsProvider } from "../../services/segmentAnalytics/tests";
import { prepareDeletedItemName } from "../../util/softDelete";
import { TeamService } from "./team.service";

const EXAMPLE_TEAM_ID = "exampleTeamId";
const EXAMPLE_NAME = "exampleName";
const EXAMPLE_WORKSPACE_ID = "exampleWorkspaceId";
const EXAMPLE_TEAM_NAME = "exampleTeamName";

const EXAMPLE_WORKSPACE: Workspace = {
  id: EXAMPLE_WORKSPACE_ID,
  createdAt: new Date(),
  updatedAt: new Date(),
  name: EXAMPLE_NAME,
  allowLLMFeatures: true,
};

const EXAMPLE_TEAM: Team = {
  id: EXAMPLE_TEAM_ID,
  name: EXAMPLE_TEAM_NAME,
  createdAt: new Date(),
  updatedAt: new Date(),
  workspace: EXAMPLE_WORKSPACE,
  workspaceId: EXAMPLE_WORKSPACE_ID,
};

const EXAMPLE_USER: User = {
  id: "exampleUserId",
  createdAt: new Date(),
  updatedAt: new Date(),
  isOwner: true,
};
const prismaTeamUpdateMock = jest.fn(() => {
  return EXAMPLE_TEAM;
});
const prismaTeamFindFirstMock = jest.fn(() => {
  return EXAMPLE_TEAM;
});
const prismaTeamCreateMock = jest.fn(() => {
  return EXAMPLE_TEAM;
});
const prismaTeamFindManyMock = jest.fn(() => {
  return [EXAMPLE_TEAM];
});

const prismaUserFindManyMock = jest.fn(() => {
  return [EXAMPLE_USER];
});

describe("TeamService", () => {
  let service: TeamService;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,

        {
          provide: PrismaService,
          useClass: jest.fn().mockImplementation(() => ({
            team: {
              create: prismaTeamCreateMock,
              findMany: prismaTeamFindManyMock,
              findUnique: prismaTeamFindFirstMock,
              update: prismaTeamUpdateMock,
            },
            user: {
              findMany: prismaUserFindManyMock,
            },
          })),
        },

        MockedSegmentAnalyticsProvider(),
      ],
    }).compile();

    service = module.get<TeamService>(TeamService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("should create a team", async () => {
    // arrange
    const args = {
      data: {
        name: EXAMPLE_NAME,
        workspace: {
          connect: {
            id: EXAMPLE_WORKSPACE_ID,
          },
        },
      },
    };

    // act
    const newTeam = await service.createTeam(args);

    // assert
    expect(newTeam).toEqual(EXAMPLE_TEAM);
    expect(prismaTeamCreateMock).toHaveBeenCalledTimes(1);
    expect(prismaTeamCreateMock).toHaveBeenCalledWith(args);
  });

  it("should delete a team", async () => {
    const args = { where: { id: EXAMPLE_TEAM_ID } };
    const dateSpy = jest.spyOn(global, "Date");
    expect(await service.deleteTeam(args)).toEqual(EXAMPLE_TEAM);

    expect(prismaTeamUpdateMock).toHaveBeenCalledTimes(1);
    expect(prismaTeamUpdateMock).toHaveBeenCalledWith({
      ...args,
      data: {
        deletedAt: dateSpy.mock.instances[0],
        name: prepareDeletedItemName(EXAMPLE_TEAM.name, EXAMPLE_TEAM.id),
      },
    });
  });

  it("should get a single team", async () => {
    const args = { where: { id: EXAMPLE_TEAM_ID } };
    expect(await service.team(args)).toEqual(EXAMPLE_TEAM);
    expect(prismaTeamFindFirstMock).toHaveBeenCalledTimes(1);
    expect(prismaTeamFindFirstMock).toHaveBeenCalledWith({
      ...args,
      where: {
        ...args.where,
        deletedAt: null,
      },
    });
  });

  it("should find teams", async () => {
    const args = {
      where: {
        name: {
          contains: EXAMPLE_TEAM_NAME,
        },
      },
    };
    expect(await service.teams(args)).toEqual([EXAMPLE_TEAM]);
    expect(prismaTeamFindManyMock).toHaveBeenCalledTimes(1);
    expect(prismaTeamFindManyMock).toHaveBeenCalledWith({
      ...args,
      where: {
        ...args.where,
        deletedAt: null,
      },
    });
  });

  it("should update a team", async () => {
    const args = {
      data: {
        name: EXAMPLE_NAME,
      },
      where: {
        id: EXAMPLE_TEAM_ID,
      },
    };
    expect(await service.updateTeam(args)).toEqual(EXAMPLE_TEAM);
    expect(prismaTeamUpdateMock).toHaveBeenCalledTimes(1);
    expect(prismaTeamUpdateMock).toHaveBeenCalledWith(args);
  });

  it("should add members to a team", async () => {
    const args = {
      data: {
        userIds: ["memberId", "memberId2"],
      },
      where: {
        id: EXAMPLE_TEAM_ID,
      },
    };

    prismaUserFindManyMock.mockReturnValueOnce([]);

    expect(await service.addMembersToTeam(args)).toEqual(EXAMPLE_TEAM);
    expect(prismaTeamUpdateMock).toHaveBeenCalledTimes(1);
    expect(prismaTeamUpdateMock).toHaveBeenCalledWith({
      where: args.where,
      data: {
        members: {
          connect: args.data.userIds.map((userId) => ({
            id: userId,
          })),
        },
      },
    });
  });

  it("should throw an error when adding invalid members to a team", async () => {
    const userIds = ["memberId", "memberId2"];

    const args = {
      data: {
        userIds,
      },
      where: {
        id: EXAMPLE_TEAM_ID,
      },
    };

    prismaUserFindManyMock.mockReturnValueOnce([EXAMPLE_USER]);

    await expect(service.addMembersToTeam(args)).rejects.toThrow();

    expect(prismaUserFindManyMock).toHaveBeenCalledTimes(1);
    expect(prismaUserFindManyMock).toHaveBeenCalledWith({
      where: {
        id: {
          in: userIds,
        },
        // eslint-disable-next-line @typescript-eslint/naming-convention
        OR: [
          {
            deletedAt: {
              not: null,
            },
          },
          {
            workspaceId: {
              not: EXAMPLE_TEAM.workspaceId,
            },
          },
        ],
      },
    });
  });

  it("should remove members from a team", async () => {
    const args = {
      data: {
        userIds: ["memberId", "memberId2"],
      },
      where: {
        id: EXAMPLE_TEAM_ID,
      },
    };

    expect(await service.removeMembersFromTeam(args)).toEqual(EXAMPLE_TEAM);
    expect(prismaTeamUpdateMock).toHaveBeenCalledTimes(1);
    expect(prismaTeamUpdateMock).toHaveBeenCalledWith({
      where: args.where,
      data: {
        members: {
          disconnect: args.data.userIds.map((userId) => ({
            id: userId,
          })),
        },
      },
    });
  });
});
