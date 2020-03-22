import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { PasswordService } from './password.service';
import { PrismaModule } from '../../services/prisma.module';
import { ApplicationModelsModule} from '../../models/applicationModels.module';

@Module({
  imports: [PrismaModule, ApplicationModelsModule],
  providers: [AccountService, PasswordService],
  exports: [AccountService, PasswordService]
})
export class AccountModule {}
