import { Module } from '@nestjs/common';
import { PrismaModule } from '@amplication/prisma-db';
import { GitOrganizationDal } from './gitOrganization.dal.service';

@Module({
  imports: [PrismaModule],
  providers: [GitOrganizationDal],
  exports: [GitOrganizationDal],
})
export class GitOrganizationModule {}
