import { Injectable } from "@nestjs/common";
import { Account, Prisma } from "../../prisma";
import { PrismaService } from "../../prisma/prisma.service";
import { Workspace } from "../../models";
import {
  SegmentAnalyticsService,
  EnumEventType,
  IdentifyData,
} from "../../services/segmentAnalytics/segmentAnalytics.service";

@Injectable()
export class AccountService {
  constructor(
    private prisma: PrismaService,
    private analytics: SegmentAnalyticsService
  ) {}

  async createAccount(
    args: Prisma.AccountCreateArgs,
    identityProvider: string
  ): Promise<Account> {
    const account = await this.prisma.account.create(args);

    const userData: IdentifyData = {
      userId: account.id,
      createdAt: account.createdAt,
      email: account.email,
      firstName: account.firstName,
      lastName: account.lastName,
    };

    await this.analytics.identify(userData);
    //we send the userData again to prevent race condition
    await this.analytics.track({
      userId: account.id,
      event: EnumEventType.Signup,
      properties: {
        identityProvider,
      },
      context: {
        traits: userData,
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
