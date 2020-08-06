import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationResolver } from './organization.resolver';
import { PrismaModule } from 'src/services/prisma.module';
import { AccountModule } from '../account/account.module';
import { AppModule } from '../app/app.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [PrismaModule, AccountModule, AppModule, PermissionsModule],
  providers: [OrganizationService, OrganizationResolver],
  exports: [OrganizationService, OrganizationResolver]
})
export class OrganizationModule {}
