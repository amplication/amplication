import { Prisma, PrismaService } from '@amplication/prisma-db';
import { ConflictException, Injectable } from '@nestjs/common';
import { Account, User, UserRole } from 'src/models';
import { UserRoleArgs } from './dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  findUser(args: Prisma.UserFindUniqueArgs): Promise<User> {
    return this.prisma.user.findFirst({
      ...args,
      where: {
        ...args.where,
        deletedAt: null
      }
    });
  }

  findUsers(args: Prisma.UserFindManyArgs): Promise<User[]> {
    return this.prisma.user.findMany({
      ...args,
      where: {
        ...args.where,
        deletedAt: null
      }
    });
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

    return this.findUser({
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

    return this.findUser({
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

  async delete(userId: string): Promise<User> {
    const user = this.findUser({
      where: {
        id: userId
      }
    });

    if (!user) {
      throw new ConflictException(`Can't find user with ID ${userId}`);
    }

    return this.prisma.user.update({
      where: {
        id: userId
      },
      data: {
        deletedAt: new Date()
      }
    });
  }
}
