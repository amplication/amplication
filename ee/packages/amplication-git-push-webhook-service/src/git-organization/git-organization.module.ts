import { PrismaService } from '../prisma';
import { GitOrganizationRepository } from './git-organization.repository';
import { Module } from '@nestjs/common';

@Module({
  providers: [PrismaService, GitOrganizationRepository],
  exports: [GitOrganizationRepository],
})
export class GitOrganizationModule {}
