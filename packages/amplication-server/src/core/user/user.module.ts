import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { PrismaModule } from 'nestjs-prisma';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [PrismaModule, PermissionsModule],
  providers: [UserService, UserResolver],
  exports: [UserService, UserResolver]
})
export class UserModule {}
