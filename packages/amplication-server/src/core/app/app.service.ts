import { Injectable, BadRequestException } from '@nestjs/common';
import { App } from '../../models';
import { PrismaService } from '../../services/prisma.service';
import { WhereUniqueInput } from '../../dto/inputs';
import { WhereParentIdInput } from '../../dto/inputs';

import {
  CreateOneAppArgs,
  FindManyAppArgs,
  FindOneArgs,
  UpdateOneAppArgs
} from '../../dto/args';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async createApp(args: CreateOneAppArgs): Promise<App> {
    return this.prisma.app.create(args);
  }

  async app(args: FindOneArgs): Promise<App | null> {
    return this.prisma.app.findOne(args);
  }

  async apps(args: FindManyAppArgs): Promise<App[]> {
    return this.prisma.app.findMany(args);
  }

  async deleteApp(args: FindOneArgs): Promise<App | null> {
    return this.prisma.app.delete(args);
  }

  async updateApp(args: UpdateOneAppArgs): Promise<App | null> {
    return this.prisma.app.update(args);
  }
}
