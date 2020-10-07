import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import cuid from 'cuid';

import {
  Environment,
  CreateEnvironmentArgs,
  UpdateOneEnvironmentArgs,
  FindManyEnvironmentArgs
} from './dto';
import { FindOneArgs } from 'src/dto';

export const DEFAULT_ENVIRONMENT_NAME = 'Sandbox environment';

@Injectable()
export class EnvironmentService {
  constructor(private readonly prisma: PrismaService) {}

  async createEnvironment(args: CreateEnvironmentArgs): Promise<Environment> {
    return this.prisma.environment.create(args);
  }

  async createDefaultEnvironment(appId: string): Promise<Environment> {
    return this.createEnvironment({
      data: {
        app: {
          connect: {
            id: appId
          }
        },
        address: cuid(),
        name: DEFAULT_ENVIRONMENT_NAME
      }
    });
  }

  async findOne(args: FindOneArgs): Promise<Environment | null> {
    return this.prisma.environment.findOne(args);
  }

  async findMany(args: FindManyEnvironmentArgs): Promise<Environment[]> {
    return this.prisma.environment.findMany(args);
  }
  async updateEnvironment(
    args: UpdateOneEnvironmentArgs
  ): Promise<Environment | null> {
    return this.prisma.environment.update(args);
  }
}
