import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { User, UserRole, Account } from 'src/models';
import { UserRoleArgs } from './dto';

import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  findUser(args: Prisma.UserFindUniqueArgs): Promise<User> {
    return this.prisma.user.findUnique(args);
  }

  findUsers(args: Prisma.UserFindManyArgs): Promise<User[]> {
    return this.prisma.user.findMany(args);
  }

  async assignRole(args: UserRoleArgs): Promise<User> {
    const existingRole = await this.prisma.userRole.findMany({
      where: {
        user: {
          id: args.where.id
        },
        role: args.data.role
      }
    });

    //if the role already exist do nothing and return the user
    if (!existingRole || !existingRole.length) {
      const roleData: Prisma.UserRoleCreateArgs = {
        data: {
          role: args.data.role,
          user: { connect: { id: args.where.id } }
        }
      };

      await this.prisma.userRole.create(roleData);
    }

    return this.prisma.user.findUnique({
      where: {
        id: args.where.id
      }
    });
  }

  async removeRole(args: UserRoleArgs): Promise<User> {
    const existingRole = await this.prisma.userRole.findMany({
      where: {
        user: {
          id: args.where.id
        },
        role: args.data.role
      }
    });

    //if the role already exist do nothing and return the user
    if (existingRole && existingRole.length) {
      await this.prisma.userRole.delete({
        where: {
          id: existingRole[0].id
        }
      });
    }

    return this.prisma.user.findUnique({
      where: {
        id: args.where.id
      }
    });
  }

  async getRoles(id: string): Promise<UserRole[]> {
    return this.prisma.userRole.findMany({
      where: {
        user: {
          id
        }
      }
    });
  }

  async getAccount(id: string): Promise<Account> {
    return this.prisma.user
      .findUnique({
        where: {
          id
        }
      })
      .account();
  }
}
