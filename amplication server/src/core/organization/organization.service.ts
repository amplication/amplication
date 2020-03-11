import { Injectable } from '@nestjs/common';
import { Organization } from '../../models';
import { PrismaService } from './../../services/prisma.service';
import { OrganizationWhereUniqueInput } from '../../dto/inputs';

import {
  FindManyOrganizationArgs,
  FindOneOrganizationArgs,
  UpdateOneOrganizationArgs
} from '../../dto/args';

@Injectable()
export class OrganizationService {
  constructor(private readonly prisma: PrismaService) {}

  async Organization(args: FindOneOrganizationArgs): Promise<Organization | null> {
    return this.prisma.organization.findOne(args);
  }

  async Organizations(args: FindManyOrganizationArgs): Promise<Organization[]> {
    return this.prisma.organization.findMany(args);
  }

  async deleteOrganization(args: FindOneOrganizationArgs): Promise<Organization | null> {
    return this.prisma.organization.delete(args);
  }

  async updateOrganization(args: UpdateOneOrganizationArgs): Promise<Organization | null> {
    return this.prisma.organization.update(args);
  }
}
