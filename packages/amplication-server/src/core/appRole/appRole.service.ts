import { Injectable } from '@nestjs/common';
import { AppRole } from 'src/models';
import { PrismaService } from '@amplication/prisma-db';

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
    return this.prisma.resourceRole.create(args);
  }

  async getAppRole(args: FindOneArgs): Promise<AppRole | null> {
    return this.prisma.resourceRole.findUnique(args);
  }

  async getAppRoles(args: FindManyAppRoleArgs): Promise<AppRole[]> {
    return this.prisma.resourceRole.findMany(args);
  }

  async deleteAppRole(args: FindOneArgs): Promise<AppRole | null> {
    return this.prisma.resourceRole.delete(args);
  }

  async updateAppRole(args: UpdateOneAppRoleArgs): Promise<AppRole | null> {
    return this.prisma.resourceRole.update(args);
  }
}
