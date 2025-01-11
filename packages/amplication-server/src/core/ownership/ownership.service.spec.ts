import { Test, TestingModule } from "@nestjs/testing";
import { OwnershipService } from "./ownership.service";
import { PrismaService } from "../../prisma/prisma.service";
import { EnumOwnershipType } from "./dto/EnumOwnershipType";
import { Ownership } from "./dto/Ownership";
import { Team, User } from "../../models";

const EXAMPLE_TEAM: Team = {
  id: "team1",
  name: "team1",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const EXAMPLE_USER: User = {
  id: "user1",
  createdAt: undefined,
  updatedAt: undefined,
  isOwner: false,
};

const EXAMPLE_TEAM_OWNERSHIP: Ownership = {
  id: "1",
  ownershipType: EnumOwnershipType.Team,
  owner: EXAMPLE_TEAM,
};

const EXAMPLE_USER_OWNERSHIP: Ownership = {
  id: "2",
  ownershipType: EnumOwnershipType.User,
  owner: EXAMPLE_USER,
};

const EXAMPLE_PRISMA_TEAM_OWNERSHIP = {
  id: "1",
  teamId: "team1",
  team: EXAMPLE_TEAM,
  userId: undefined,
  user: undefined,
};

const EXAMPLE_PRISMA_USER_OWNERSHIP = {
  id: "2",
  teamId: undefined,
  team: undefined,
  userId: "user1",
  user: EXAMPLE_USER,
};

const prismaServiceCreateOwnershipMock = jest.fn(
  () => EXAMPLE_PRISMA_TEAM_OWNERSHIP
);

const prismaServiceUpdateOwnershipMock = jest.fn(
  () => EXAMPLE_PRISMA_TEAM_OWNERSHIP
);

const prismaServiceFindUniqueMock = jest.fn(
  () => EXAMPLE_PRISMA_TEAM_OWNERSHIP
);

const prismaService = {
  ownership: {
    create: prismaServiceCreateOwnershipMock,
    update: prismaServiceUpdateOwnershipMock,
    findUnique: prismaServiceFindUniqueMock,
  },
};

describe("OwnershipService", () => {
  let service: OwnershipService;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OwnershipService,

        {
          provide: PrismaService,
          useClass: jest.fn().mockImplementation(() => prismaService),
        },
      ],
    }).compile();

    service = module.get<OwnershipService>(OwnershipService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createOwnership", () => {
    it("should create a team ownership", async () => {
      const result = await service.createOwnership(
        EnumOwnershipType.Team,
        "team1"
      );

      expect(result).toEqual(EXAMPLE_TEAM_OWNERSHIP);
      expect(prismaService.ownership.create).toHaveBeenCalledWith({
        data: {
          team: {
            connect: {
              id: "team1",
            },
          },
        },
        include: {
          team: true,
          user: true,
        },
      });
    });

    it("should create a user ownership", async () => {
      prismaService.ownership.create.mockReturnValueOnce(
        EXAMPLE_PRISMA_USER_OWNERSHIP
      );

      const result = await service.createOwnership(
        EnumOwnershipType.User,
        "user1"
      );

      expect(result).toEqual(EXAMPLE_USER_OWNERSHIP);
      expect(prismaService.ownership.create).toHaveBeenCalledWith({
        data: {
          user: {
            connect: {
              id: "user1",
            },
          },
        },
        include: {
          team: true,
          user: true,
        },
      });
    });
  });

  describe("updateOwnership", () => {
    it("should update a team ownership", async () => {
      const result = await service.updateOwnership(
        "1",
        EnumOwnershipType.Team,
        "team1"
      );

      expect(result).toEqual(EXAMPLE_TEAM_OWNERSHIP);
      expect(prismaService.ownership.update).toHaveBeenCalledWith({
        where: {
          id: "1",
        },
        data: {
          team: {
            connect: {
              id: "team1",
            },
          },
          user: {
            disconnect: true,
          },
        },
        include: {
          team: true,
          user: true,
        },
      });
    });

    it("should update a user ownership", async () => {
      prismaService.ownership.update.mockReturnValueOnce(
        EXAMPLE_PRISMA_USER_OWNERSHIP
      );

      const result = await service.updateOwnership(
        "2",
        EnumOwnershipType.User,
        "user1"
      );

      expect(result).toEqual(EXAMPLE_USER_OWNERSHIP);
      expect(prismaService.ownership.update).toHaveBeenCalledWith({
        where: {
          id: "2",
        },
        data: {
          user: {
            connect: {
              id: "user1",
            },
          },
          team: {
            disconnect: true,
          },
        },
        include: {
          team: true,
          user: true,
        },
      });
    });
  });

  describe("getOwnership", () => {
    it("should return a team ownership", async () => {
      prismaService.ownership.findUnique.mockReturnValueOnce(
        EXAMPLE_PRISMA_TEAM_OWNERSHIP
      );

      const result = await service.getOwnership("1");

      expect(result).toEqual(EXAMPLE_TEAM_OWNERSHIP);
      expect(prismaService.ownership.findUnique).toHaveBeenCalledWith({
        where: {
          id: "1",
        },
        include: {
          team: {
            where: {
              deletedAt: null,
            },
          },
          user: {
            where: {
              deletedAt: null,
            },
          },
        },
      });
    });

    it("should return a user ownership", async () => {
      prismaService.ownership.findUnique.mockReturnValueOnce(
        EXAMPLE_PRISMA_USER_OWNERSHIP
      );

      const result = await service.getOwnership("2");

      expect(result).toEqual(EXAMPLE_USER_OWNERSHIP);
      expect(prismaService.ownership.findUnique).toHaveBeenCalledWith({
        where: {
          id: "2",
        },
        include: {
          team: {
            where: {
              deletedAt: null,
            },
          },
          user: {
            where: {
              deletedAt: null,
            },
          },
        },
      });
    });
  });
});
