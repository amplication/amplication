import { Injectable } from '@nestjs/common';
import { AppRole, User } from 'src/models';
import { PrismaService } from 'src/services/prisma.service';

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

  async AppRole(args: FindOneArgs): Promise<AppRole | null> {
    return this.prisma.appRole.findOne(args);
  }

  async AppRoles(args: FindManyAppRoleArgs): Promise<AppRole[]> {
    return this.prisma.appRole.findMany(args);
  }

  async deleteAppRole(args: FindOneArgs): Promise<AppRole | null> {
    return this.prisma.appRole.delete(args);
  }

  async updateAppRole(args: UpdateOneAppRoleArgs): Promise<AppRole | null> {
    return this.prisma.appRole.update(args);
  }
}
