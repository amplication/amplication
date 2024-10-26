import { Injectable } from "@nestjs/common";
import { EnumOwnershipType, Ownership } from "./dto/Ownership";
import {
  Ownership as PrismaOwnership,
  User as PrismaUser,
  Team as PrismaTeam,
  PrismaService,
} from "../../prisma";

export const INVALID_OWNERSHIP_ID = "Invalid ownershipId";
export const INVALID_MEMBERS = "Invalid members";

@Injectable()
export class OwnershipService {
  constructor(private readonly prisma: PrismaService) {}

  async createOwnership(
    ownershipType: EnumOwnershipType,
    ownerId: string
  ): Promise<Ownership> {
    const ownership = await this.prisma.ownership.create({
      data:
        ownershipType === EnumOwnershipType.Team
          ? {
              team: {
                connect: {
                  id: ownerId,
                },
              },
            }
          : {
              user: {
                connect: {
                  id: ownerId,
                },
              },
            },
      include: {
        team: true,
        user: true,
      },
    });

    return this.ownershipRecordToOwnership(ownership);
  }

  async updateOwnership(
    ownershipId: string,
    ownershipType: EnumOwnershipType,
    ownerId: string
  ): Promise<Ownership> {
    const ownership = await this.prisma.ownership.update({
      where: {
        id: ownershipId,
      },
      data:
        ownershipType === EnumOwnershipType.Team
          ? {
              team: {
                connect: {
                  id: ownerId,
                },
              },
              user: {
                disconnect: true,
              },
            }
          : {
              user: {
                connect: {
                  id: ownerId,
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

    return this.ownershipRecordToOwnership(ownership);
  }

  async getOwnership(ownershipId: string): Promise<Ownership> {
    const ownership = await this.prisma.ownership.findUnique({
      where: {
        id: ownershipId,
      },
      include: {
        team: true,
        user: true,
      },
    });

    if (!ownership) {
      throw new Error(INVALID_OWNERSHIP_ID);
    }

    return this.ownershipRecordToOwnership(ownership);
  }

  private async ownershipRecordToOwnership(
    ownership: PrismaOwnership & {
      team: PrismaTeam;
      user: PrismaUser;
    }
  ): Promise<Ownership> {
    if (ownership.team) {
      return {
        id: ownership.id,
        owner: ownership.team,
        ownershipType: EnumOwnershipType.Team,
      };
    } else {
      return {
        id: ownership.id,
        owner: ownership.user,
        ownershipType: EnumOwnershipType.User,
      };
    }
  }
}
