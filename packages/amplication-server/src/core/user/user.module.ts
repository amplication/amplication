import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './userResolver';
import { PrismaModule } from '../../services/prisma.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [PrismaModule, PermissionsModule],
  providers: [UserService, UserResolver],
  exports: [UserService, UserResolver]
})
export class UserModule {}
