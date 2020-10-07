import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import {
  Environment,
  CreateEnvironmentArgs,
  UpdateOneEnvironmentArgs
} from './dto';
import { FindOneArgs } from 'src/dto';

@Injectable()
export class EnvironmentService {
  constructor(private readonly prisma: PrismaService) {}

  async createEnvironment(args: CreateEnvironmentArgs): Promise<Environment> {
    return this.prisma.environment.create(args);
  }

  async getEnvironment(args: FindOneArgs): Promise<Environment | null> {
    return this.prisma.environment.findOne(args);
  }
  async updateEnvironment(
    args: UpdateOneEnvironmentArgs
  ): Promise<Environment | null> {
    return this.prisma.environment.update(args);
  }
}
