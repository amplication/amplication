import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import cuid from 'cuid';

import {
  Environment,
  CreateEnvironmentArgs,
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
  async getDefaultEnvironment(appId: string): Promise<Environment | null> {
    const environments = await this.findMany({
      where: {
        app: {
          id: appId
        },
        name: {
          equals: DEFAULT_ENVIRONMENT_NAME
        }
      },
      take: 1
    });

    return environments[0];
  }

  async findOne(args: FindOneArgs): Promise<Environment | null> {
    return this.prisma.environment.findUnique(args);
  }

  async findMany(args: FindManyEnvironmentArgs): Promise<Environment[]> {
    return this.prisma.environment.findMany(args);
  }
}
