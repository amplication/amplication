import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { PasswordService } from './password.service';
import {PrismaModule} from '../../services/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AccountService, PasswordService],
  exports: [AccountService, PasswordService]
})
export class AccountModule {}
