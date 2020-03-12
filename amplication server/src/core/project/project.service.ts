import { Injectable } from '@nestjs/common';
import { Project } from '../../models';
import { PrismaService } from './../../services/prisma.service';
import { WhereUniqueInput } from '../../dto/inputs';
import { OrganizationCreateOneWithoutProjectsInput } from '../../dto/inputs';

import {
  CreateOneProjectArgs,
  FindManyProjectArgs,
  FindOneProjectArgs,
  UpdateOneProjectArgs
} from '../../dto/args';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async createProject(args: CreateOneProjectArgs): Promise<Project> {
    args.data.organization = new OrganizationCreateOneWithoutProjectsInput();
    args.data.organization.connect = new WhereUniqueInput();
    args.data.organization.connect.id = 'ck799xnud0000cwfpprwm0uj0';

    return this.prisma.project.create(args);
  }

  async project(args: FindOneProjectArgs): Promise<Project | null> {
    return this.prisma.project.findOne(args);
  }

  async projects(args: FindManyProjectArgs): Promise<Project[]> {
    return this.prisma.project.findMany(args);
  }

  async deleteProject(args: FindOneProjectArgs): Promise<Project | null> {
    return this.prisma.project.delete(args);
  }

  async updateProject(args: UpdateOneProjectArgs): Promise<Project | null> {
    return this.prisma.project.update(args);
  }
}
