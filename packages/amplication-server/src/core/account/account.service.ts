import { Injectable } from "@nestjs/common";
import { Account, Prisma } from "../../prisma";
import { PrismaService } from "../../prisma/prisma.service";
import { Workspace } from "../../models";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import { EnumEventType } from "../../services/segmentAnalytics/segmentAnalytics.types";
import { IdentifyData } from "../../services/segmentAnalytics/segmentAnalytics.types";

@Injectable()
export class AccountService {
  constructor(
    private prisma: PrismaService,
    private analytics: SegmentAnalyticsService
  ) {}

  async createAccount(
    args: Prisma.AccountCreateArgs,
    trackingMetadata: Record<string, any>
  ): Promise<Account> {
    const account = await this.prisma.account.create(args);

    const userData: IdentifyData = {
      accountId: account.id,
      createdAt: account.createdAt,
      email: account.email,
      firstName: account.firstName,
      lastName: account.lastName,
    };

    await this.analytics.identify(userData);
    await this.analytics.trackManual({
      user: {
        accountId: account.id,
      },
      data: {
        event: EnumEventType.Signup,
        properties: {
          ...trackingMetadata,
        },
      },
    });
    return account;
  }

  findAccount(args: Prisma.AccountFindUniqueArgs): Promise<Account> {
    return this.prisma.account.findUnique(args);
  }

  updateAccount(args: Prisma.AccountUpdateArgs): Promise<Account> {
    return this.prisma.account.update(args);
  }

  setCurrentUser(accountId: string, userId: string) {
    return this.prisma.account.update({
      data: {
        currentUser: {
          connect: {
            id: userId,
          },
        },
      },
      where: {
        id: accountId,
      },
    });
  }

  getWorkspaces(accountId: string): Promise<Workspace[]> {
    return this.prisma.workspace.findMany({
      where: {
        users: {
          some: {
            accountId: accountId,
            deletedAt: null,
          },
        },
      },
    });
  }

  async setPassword(accountId: string, password: string): Promise<Account> {
    return this.prisma.account.update({
      data: {
        password,
      },
      where: { id: accountId },
    });
  }
}
