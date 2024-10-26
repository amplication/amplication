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

    return this.ownershipRecordToOwnership(ownership, ownershipType);
  }

  async updateOwnership(
    ownershipId: string,
    ownerId: string,
    ownershipType: EnumOwnershipType
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

    return this.ownershipRecordToOwnership(ownership, ownershipType);
  }

  private async ownershipRecordToOwnership(
    ownership: PrismaOwnership & {
      team: PrismaTeam;
      user: PrismaUser;
    },
    ownershipType: EnumOwnershipType
  ): Promise<Ownership> {
    if (ownershipType === EnumOwnershipType.Team) {
      return {
        id: ownership.id,
        owner: ownership.team,
        ownershipType,
      };
    } else {
      return {
        id: ownership.id,
        owner: ownership.user,
        ownershipType,
      };
    }
  }
}
