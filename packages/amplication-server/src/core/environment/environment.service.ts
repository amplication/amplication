import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import cuid from "cuid";

import {
  Environment,
  CreateEnvironmentArgs,
  FindManyEnvironmentArgs,
} from "./dto";
import { FindOneArgs } from "../../dto";

export const DEFAULT_ENVIRONMENT_NAME = "Sandbox environment";

@Injectable()
export class EnvironmentService {
  constructor(private readonly prisma: PrismaService) {}

  async createEnvironment(args: CreateEnvironmentArgs): Promise<Environment> {
    return this.prisma.environment.create(args);
  }

  async createDefaultEnvironment(resourceId: string): Promise<Environment> {
    return this.createEnvironment({
      data: {
        resource: {
          connect: {
            id: resourceId,
          },
        },
        address: cuid(),
        name: DEFAULT_ENVIRONMENT_NAME,
      },
    });
  }
  async getDefaultEnvironment(resourceId: string): Promise<Environment | null> {
    const environments = await this.findMany({
      where: {
        resource: {
          id: resourceId,
        },
        name: {
          equals: DEFAULT_ENVIRONMENT_NAME,
        },
      },
      take: 1,
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
