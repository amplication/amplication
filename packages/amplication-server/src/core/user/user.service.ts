import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { User, UserRole, Account } from 'src/models';
import { FindOneArgs } from 'src/dto';
import { UserRoleArgs, FindManyUserArgs } from './dto';

import { UserRoleCreateArgs, FindManyUserRoleArgs } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  findUser(args: FindOneArgs): Promise<User> {
    return this.prisma.user.findOne(args);
  }

  findUsers(args: FindManyUserArgs): Promise<User[]> {
    return this.prisma.user.findMany(args);
  }

  async assignRole(args: UserRoleArgs): Promise<User> {
    const find: FindManyUserRoleArgs = {
      where: {
        user: {
          id: args.where.id
        },
        role: args.data.role
      }
    };

    const existingRole = await this.prisma.userRole.findMany(find);

    //if the role already exist do nothing and return the user
    if (!existingRole || !existingRole.length) {
      const roleData: UserRoleCreateArgs = {
        data: {
          role: args.data.role,
          user: { connect: { id: args.where.id } }
        }
      };

      await this.prisma.userRole.create(roleData);
    }

    const findOneArgs: FindOneArgs = {
      where: {
        id: args.where.id
      }
    };

    return this.prisma.user.findOne(findOneArgs);
  }

  async removeRole(args: UserRoleArgs): Promise<User> {
    const find: FindManyUserRoleArgs = {
      where: {
        user: {
          id: args.where.id
        },
        role: args.data.role
      }
    };

    const existingRole = await this.prisma.userRole.findMany(find);

    //if the role already exist do nothing and return the user
    if (existingRole && existingRole.length) {
      await this.prisma.userRole.delete({
        where: {
          id: existingRole[0].id
        }
      });
    }

    const findOneArgs: FindOneArgs = {
      where: {
        id: args.where.id
      }
    };

    return this.prisma.user.findOne(findOneArgs);
  }

  async getRoles(id: string): Promise<UserRole[]> {
    const args: FindManyUserRoleArgs = {
      where: {
        user: {
          id
        }
      }
    };

    return this.prisma.userRole.findMany(args);
  }

  async getAccount(id: string): Promise<Account> {
    const args: FindOneArgs = {
      where: {
        id
      }
    };

    return this.prisma.user.findOne(args).account();
  }
}
