import { PrismaService } from '@amplication/prisma-db';
import { Injectable } from '@nestjs/common';
import { FindOneArgs } from 'src/dto';
import { Project } from 'src/models';
import { ProjectCreateArgs } from './dto/ProjectCreateArgs';
import { ProjectFindManyArgs } from './dto/ProjectFindManyArgs';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  async findProjects(args: ProjectFindManyArgs): Promise<Project[]> {
    return this.prisma.project.findMany(args);
  }

  async findProject(args: FindOneArgs): Promise<Project> {
    return this.prisma.project.findUnique(args);
  }

  async createProject(args: ProjectCreateArgs): Promise<Project> {
    return this.prisma.project.create({
      data: {
        ...args.data,
        workspace: {
          connect: {
            id: args.data.workspace.connect.id
          }
        }
      }
    });
  }
}
