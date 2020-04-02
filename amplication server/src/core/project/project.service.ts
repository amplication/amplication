import { Injectable,BadRequestException } from '@nestjs/common';
import { Project } from '../../models';
import { PrismaService } from '../../services/prisma.service';
import { WhereUniqueInput } from '../../dto/inputs';
import { WhereParentIdInput } from '../../dto/inputs';

import {
  CreateOneProjectArgs,
  FindManyProjectArgs,
  FindOneArgs,
  UpdateOneProjectArgs
} from '../../dto/args';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async createProject(args: CreateOneProjectArgs): Promise<Project> {
    return this.prisma.project.create(args);
  }

  async project(args: FindOneArgs): Promise<Project | null> {
    return this.prisma.project.findOne(args);
  }

  async projects(args: FindManyProjectArgs): Promise<Project[]> {
    return this.prisma.project.findMany(args);
  }

  async deleteProject(args: FindOneArgs): Promise<Project | null> {
    return this.prisma.project.delete(args);
  }

  async updateProject(args: UpdateOneProjectArgs): Promise<Project | null> {
    return this.prisma.project.update(args);
  }
}
