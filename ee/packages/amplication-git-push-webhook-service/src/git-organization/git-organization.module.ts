import { Module } from '@nestjs/common';
import { PrismaModule } from '@amplication/prisma-db';
import { GitOrganizationRepository } from './git-organization.repository';

@Module({
  imports: [PrismaModule],
  providers: [GitOrganizationRepository],
  exports: [GitOrganizationRepository],
})
export class GitOrganizationModule {}
