import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationResolver } from './organization.resolver';
import { PrismaModule } from 'nestjs-prisma';
import { AccountModule } from '../account/account.module';
import { AppModule } from '../app/app.module';
import { EntityModule } from '../entity/entity.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [
    PrismaModule,
    AccountModule,
    AppModule,
    PermissionsModule,
    EntityModule
  ],
  providers: [OrganizationService, OrganizationResolver],
  exports: [OrganizationService, OrganizationResolver]
})
export class OrganizationModule {}
