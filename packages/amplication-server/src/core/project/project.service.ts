import { PrismaService } from '@amplication/prisma-db';
import { Injectable } from '@nestjs/common';
// import { FindOneArgs } from 'src/dto';
// import { Project } from 'src/models';
// import { CreateProjectArgs } from './dto/create-project.args';
// import { UpdateProjectArgs } from './dto/update-project.args';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  // async findProjects(args: ProjectFindManyArgs): Promise<Project[]> {
  //   return this.prisma.project.findMany(args);
  // }

  //  async findProject(args: FindOneArgs): Promise<Project> {
  //   return this.prisma.project.findUnique(args);
  //  }

  // async createProject(args: CreateProjectArgs): Promise<Project> {
  //   return this.prisma.project.create(args);
  // }

  // async updateProject(args: UpdateProjectArgs): Promise<Project> {
  //   return this.prisma.project.update(args);
  // }

  // async deleteProject(args: FindOneArgs): Promise<Project | null> {
  //   const project =  await this.prisma.project.update({
  //      ...args,
  //     data: {
  //       deletedAt: new Date()
  //     }
  //   });
  //   return project;
  // }
}
