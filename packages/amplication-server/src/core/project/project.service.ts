import { PrismaService } from '@amplication/prisma-db';
import { Injectable } from '@nestjs/common';
import { FindOneArgs } from 'src/dto';
import { Project } from 'src/models';
import { ResourceService } from '..';
import { ProjectFindManyArgs } from './dto/ProjectFindManyArgs';
@Injectable()
export class ProjectService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly resourceService: ResourceService
  ) {}

  async findProjects(args: ProjectFindManyArgs): Promise<Project[]> {
    return this.prisma.project.findMany(args);
  }

  async findProject(args: FindOneArgs): Promise<Project> {
    return this.prisma.project.findUnique(args);
  }

  async createProject(
    name: string,
    workspaceId: string,
    userId: string
  ): Promise<Project> {
    const project = await this.prisma.project.create({
      data: {
        name: name,
        workspace: {
          connect: {
            id: workspaceId
          }
        }
      }
    });
    await this.resourceService.createProjectConfiguration(project.id, userId);

    return project;
  }
}
