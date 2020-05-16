import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { PrismaModule } from '../../services/prisma.module';
import { AccountModule } from '../account/account.module';
import { AppModule } from '../app/app.module';

@Module({
  imports: [PrismaModule, AccountModule, AppModule],
  providers: [OrganizationService],
  exports: [OrganizationService]
})
export class OrganizationModule {}
