import { Injectable } from '@nestjs/common';
import { ResourceRole } from 'src/models';
import { PrismaService } from '@amplication/prisma-db';

import {
  CreateResourceRoleArgs,
  FindManyResourceRoleArgs,
  UpdateOneResourceRoleArgs
} from './dto';
import { FindOneArgs } from 'src/dto';

@Injectable()
export class ResourceRoleService {
  constructor(private readonly prisma: PrismaService) {}

  async createResourceRole(
    args: CreateResourceRoleArgs
  ): Promise<ResourceRole> {
    return this.prisma.resourceRole.create(args);
  }

  async getResourceRole(args: FindOneArgs): Promise<ResourceRole | null> {
    return this.prisma.resourceRole.findUnique(args);
  }

  async getResourceRoles(
    args: FindManyResourceRoleArgs
  ): Promise<ResourceRole[]> {
    return this.prisma.resourceRole.findMany(args);
  }

  async deleteResourceRole(args: FindOneArgs): Promise<ResourceRole | null> {
    return this.prisma.resourceRole.delete(args);
  }

  async updateResourceRole(
    args: UpdateOneResourceRoleArgs
  ): Promise<ResourceRole | null> {
    return this.prisma.resourceRole.update(args);
  }
}
