import { Injectable } from "@nestjs/common";
import { isEmpty, snakeCase, toUpper } from "lodash";
import { FindOneArgs } from "../../dto";
import { AmplicationError } from "../../errors/AmplicationError";
import { Role } from "../../models";
import { PrismaService } from "../../prisma";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import { EnumEventType } from "../../services/segmentAnalytics/segmentAnalyticsEventType.types";
import { prepareDeletedItemName } from "../../util/softDelete";
import { RoleCreateArgs } from "./dto/RoleCreateArgs";
import { RoleFindManyArgs } from "./dto/RoleFindManyArgs";
import { UpdateRoleArgs } from "./dto/UpdateRoleArgs";
import { RoleAddRemovePermissionsArgs } from "./dto/RoleAddRemovePermissionsArgs";

export const INVALID_ROLE_ID = "Invalid roleId";

@Injectable()
export class RoleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly analytics: SegmentAnalyticsService
  ) {}

  async roles(args: RoleFindManyArgs): Promise<Role[]> {
    return this.prisma.role.findMany({
      ...args,
      where: {
        ...args.where,
        deletedAt: null,
      },
    });
  }

  async role(args: FindOneArgs): Promise<Role> {
    return await this.prisma.role.findUnique({
      ...args,
      where: {
        ...args.where,
        deletedAt: null,
      },
    });
  }

  async createRole(args: RoleCreateArgs): Promise<Role> {
    const key = toUpper(snakeCase(args.data.name));

    const role = await this.prisma.role.create({
      data: {
        ...args.data,
        key,
        workspace: {
          connect: {
            id: args.data.workspace.connect.id,
          },
        },
      },
    });
    await this.analytics.trackWithContext({
      event: EnumEventType.RoleCreate,
      properties: {
        name: role.name,
      },
    });

    return role;
  }

  async deleteRole(args: FindOneArgs): Promise<Role> {
    const role = await this.role(args);

    if (isEmpty(role)) {
      throw new AmplicationError(INVALID_ROLE_ID);
    }

    const updatedRole = await this.prisma.role.update({
      where: args.where,
      data: {
        name: prepareDeletedItemName(role.name, role.id),
        key: prepareDeletedItemName(role.key, role.id),
        deletedAt: new Date(),
      },
    });
    await this.analytics.trackWithContext({
      event: EnumEventType.RoleDelete,
      properties: {
        name: role.name,
      },
    });

    return updatedRole;
  }

  async updateRole(args: UpdateRoleArgs): Promise<Role> {
    const role = await this.prisma.role.update({
      where: { ...args.where },
      data: {
        ...args.data,
      },
    });

    await this.analytics.trackWithContext({
      event: EnumEventType.RoleUpdate,
      properties: {
        name: role.name,
      },
    });

    return role;
  }

  async addPermission(args: RoleAddRemovePermissionsArgs): Promise<Role> {
    const role = await this.prisma.role.update({
      where: { ...args.where },
      data: {
        permissions: {
          push: args.data.permissions,
        },
      },
    });

    await this.analytics.trackWithContext({
      event: EnumEventType.RoleUpdate,
      properties: {
        action: "addPermissions",
        name: role.name,
      },
    });

    return role;
  }

  async removePermission(args: RoleAddRemovePermissionsArgs): Promise<Role> {
    const existingRole = await this.role({
      where: args.where,
    });

    const newPermissions = existingRole.permissions.filter(
      (permission) => !args.data.permissions.includes(permission)
    );

    const role = await this.prisma.role.update({
      where: { ...args.where },
      data: {
        permissions: {
          set: newPermissions,
        },
      },
    });

    await this.analytics.trackWithContext({
      event: EnumEventType.RoleUpdate,
      properties: {
        action: "removePermissions",
        name: role.name,
      },
    });

    return role;
  }
}
