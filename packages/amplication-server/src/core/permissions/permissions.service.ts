import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { RolesPermissions } from "@amplication/util-roles-types";
import { AuthUser } from "../auth/types";
import { VALIDATION_FUNCTIONS } from "./validation-functions";

@Injectable()
export class PermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async validateAccessAndPermissions(
    user: AuthUser,
    originType: AuthorizableOriginParameter,
    originId: string,
    requiredPermissions: RolesPermissions[]
  ): Promise<boolean> {
    return this.validateAccess(user, originType, originId);
  }

  async validateAccess(
    user: AuthUser,
    originType: AuthorizableOriginParameter,
    originId: string
  ): Promise<boolean> {
    const { workspace } = user;

    const canAccess = VALIDATION_FUNCTIONS[originType](
      this.prisma,
      originId,
      workspace.id,
      user
    );

    return canAccess;
  }
}
