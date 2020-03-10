import { Injectable } from '@nestjs/common';
import { CreateOneProjectArgs } from '../../dto/args';
import { Project } from '../../models';
import { PrismaService } from './../../services/prisma.service';
import { OrganizationWhereUniqueInput } from '../../dto/inputs';
import { OrganizationCreateOneWithoutProjectsInput } from '../../dto/inputs';

@Injectable()
export class ProjectService {

    constructor(private readonly prisma: PrismaService) {}


async createOneProject(args: CreateOneProjectArgs): Promise<Project> {
    args.data.name = args.data.name + "walla";
    
    args.data.organization = new OrganizationCreateOneWithoutProjectsInput();
    args.data.organization.connect = new OrganizationWhereUniqueInput();
    args.data.organization.connect.id = 'ck799xnud0000cwfpprwm0uj0';

    return this.prisma.project.create(args);
  }
}
