import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { PrismaModule } from '../../services/prisma.module';
import { AccountModule } from '../account/account.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [PrismaModule,AccountModule,UserModule],
  providers: [OrganizationService],
  exports: [OrganizationService]
})
export class OrganizationModule {}
