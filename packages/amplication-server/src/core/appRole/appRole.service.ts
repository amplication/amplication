import { Injectable } from '@nestjs/common';
import { AppRole } from 'src/models';
import { PrismaService } from 'nestjs-prisma';

import {
  CreateAppRoleArgs,
  FindManyAppRoleArgs,
  UpdateOneAppRoleArgs
} from './dto';
import { FindOneArgs } from 'src/dto';

@Injectable()
export class AppRoleService {
  constructor(private readonly prisma: PrismaService) {}

  async createAppRole(args: CreateAppRoleArgs): Promise<AppRole> {
    return this.prisma.appRole.create(args);
  }

  async getAppRole(args: FindOneArgs): Promise<AppRole | null> {
    return this.prisma.appRole.findUnique(args);
  }

  async getAppRoles(args: FindManyAppRoleArgs): Promise<AppRole[]> {
    return this.prisma.appRole.findMany(args);
  }

  async deleteAppRole(args: FindOneArgs): Promise<AppRole | null> {
    return this.prisma.appRole.delete(args);
  }

  async updateAppRole(args: UpdateOneAppRoleArgs): Promise<AppRole | null> {
    return this.prisma.appRole.update(args);
  }
}
