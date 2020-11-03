import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import {
  AccountCreateArgs,
  Account,
  FindOneAccountArgs,
  AccountUpdateArgs
} from '@prisma/client';

@Injectable()
export class AccountService {
  constructor(private prisma: PrismaService) {}

  createAccount(args: AccountCreateArgs): Promise<Account> {
    return this.prisma.account.create(args);
  }

  findAccount(args: FindOneAccountArgs): Promise<Account> {
    return this.prisma.account.findOne(args);
  }

  updateAccount(args: AccountUpdateArgs): Promise<Account> {
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

  async setPassword(accountId: string, password: string): Promise<Account> {
    return this.prisma.account.update({
      data: {
        password
      },
      where: { id: accountId }
    });
  }
}
