import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { PasswordService } from './password.service';
import { PrismaModule } from 'src/services/prisma.module';
import { AccountResolver } from './account.resolver';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [PrismaModule, PermissionsModule],
  providers: [AccountService, PasswordService, AccountResolver],
  exports: [AccountService, PasswordService, AccountResolver]
})
export class AccountModule {}
