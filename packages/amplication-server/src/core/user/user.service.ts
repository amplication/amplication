import { Prisma, PrismaService } from "../../prisma";
import { ConflictException, Injectable } from "@nestjs/common";
import { Account, User, UserRole } from "../../models";
import { UserRoleArgs } from "./dto";
import { KafkaProducerService } from "@amplication/util/nestjs/kafka";
import { KAFKA_TOPICS, UserAction } from "@amplication/schema-registry";
import { encryptString } from "../../util/encryptionUtil";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { BillingService } from "../billing/billing.service";
import { BillingFeature } from "../billing/billing.types";

@Injectable()
export class UserService {
  constructor(
    private readonly kafkaProducerService: KafkaProducerService,
    private readonly logger: AmplicationLogger,
    private readonly billingService: BillingService,
    private readonly prisma: PrismaService
  ) {}

  findUser(
    args: Prisma.UserFindUniqueArgs,
    includeDeleted = false
  ): Promise<User> {
    return this.prisma.user.findFirst({
      ...args,
      where: {
        ...args.where,
        deletedAt: includeDeleted ? undefined : null,
      },
    });
  }

  findUsers(args: Prisma.UserFindManyArgs): Promise<User[]> {
    return this.prisma.user.findMany({
      ...args,
      where: {
        ...args.where,
        deletedAt: null,
      },
    });
  }

  async assignRole(args: UserRoleArgs): Promise<User> {
    const existingRole = await this.prisma.userRole.findMany({
      where: {
        user: {
          id: args.where.id,
        },
        role: args.data.role,
      },
    });

    //if the role already exist do nothing and return the user
    if (!existingRole || !existingRole.length) {
      const roleData: Prisma.UserRoleCreateArgs = {
        data: {
          role: args.data.role,
          user: { connect: { id: args.where.id } },
        },
      };

      await this.prisma.userRole.create(roleData);
    }

    return this.findUser({
      where: {
        id: args.where.id,
      },
    });
  }

  async removeRole(args: UserRoleArgs): Promise<User> {
    const existingRole = await this.prisma.userRole.findMany({
      where: {
        user: {
          id: args.where.id,
        },
        role: args.data.role,
      },
    });

    //if the role already exist do nothing and return the user
    if (existingRole && existingRole.length) {
      await this.prisma.userRole.delete({
        where: {
          id: existingRole[0].id,
        },
      });
    }

    return this.findUser({
      where: {
        id: args.where.id,
      },
    });
  }

  async getRoles(id: string): Promise<UserRole[]> {
    return this.prisma.userRole.findMany({
      where: {
        user: {
          id,
        },
      },
    });
  }

  async getAccount(userId: string): Promise<Account> {
    return this.prisma.user
      .findUnique({
        where: {
          id: userId,
        },
      })
      .account();
  }

  async delete(userId: string): Promise<User> {
    const user = this.findUser({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new ConflictException(`Can't find user with ID ${userId}`);
    }

    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  async setLastActivity(
    userId: string,
    lastActive: Date = new Date()
  ): Promise<User> {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        lastActive,
      },
    });
  }

  async setNotificationRegistry(user: User) {
    const externalId = encryptString(user.id);
    const booleanEntityUserNotification =
      await this.billingService.getBooleanEntitlement(
        user.workspace.id,
        BillingFeature.Notification
      );
    const canShowUserNotification = booleanEntityUserNotification?.hasAccess;

    this.kafkaProducerService
      .emitMessage(KAFKA_TOPICS.USER_ACTION_TOPIC, <UserAction.KafkaEvent>{
        key: {},
        value: {
          userId: user.account.id,
          externalId,
          firstName: user.account.firstName,
          lastName: user.account.lastName,
          email: user.account.email,
          action: UserAction.UserActionType.CURRENT_WORKSPACE,
          enableUser: canShowUserNotification,
        },
      })
      .catch((error) =>
        this.logger.error(`Failed to que user ${user.account.id} signup`, error)
      );

    return externalId;
  }
}
