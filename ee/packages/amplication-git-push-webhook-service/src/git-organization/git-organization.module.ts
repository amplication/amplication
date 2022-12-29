import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { GitOrganizationRepository } from './git-organization.repository';

@Module({
  providers: [PrismaService, GitOrganizationRepository],
  exports: [GitOrganizationRepository],
})
export class GitOrganizationModule {}
