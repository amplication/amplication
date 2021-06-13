import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { Prisma, Account } from '@prisma/client';
import { Workspace } from 'src/models';
import { SegmentAnalyticsService } from 'src/services/segmentAnalytics/segmentAnalytics.service';
@Injectable()
export class AccountService {
  constructor(
    private prisma: PrismaService,
    private analytics: SegmentAnalyticsService
  ) {}

  async createAccount(args: Prisma.AccountCreateArgs): Promise<Account> {
    const account = await this.prisma.account.create(args);
    await this.analytics.identify({
      userId: account.id,
      createdAt: account.createdAt,
      email: account.email,
      firstName: account.firstName,
      lastName: account.lastName
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
            id: userId
          }
        }
      },
      where: {
        id: accountId
      }
    });
  }

  getWorkspaces(accountId: string): Promise<Workspace[]> {
    return this.prisma.workspace.findMany({
      where: {
        users: {
          some: {
            accountId: accountId
          }
        }
      }
    });
  }

  async setPassword(accountId: string, password: string): Promise<Account> {
    return this.prisma.account.update({
      data: {
        password
      },
      where: { id: accountId }
    });
  }
}
