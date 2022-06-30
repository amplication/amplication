import { Module } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PrismaModule } from '@amplication/prisma-db';

@Module({
  imports: [PrismaModule],
  providers: [PermissionsService],
  exports: [PermissionsService]
})
export class PermissionsModule {}
