import { Module } from '@nestjs/common';
import { BlockService } from './block.service';
import { BlockResolver } from './block.resolver';
import { PrismaModule } from '@amplication/prisma-db';
import { PermissionsModule } from '../permissions/permissions.module';
import { UserModule } from '../user/user.module';
import { DiffModule } from 'src/services/diff.module';

@Module({
  imports: [PrismaModule, UserModule, PermissionsModule, DiffModule],
  providers: [BlockService, BlockResolver],
  exports: [BlockService, BlockResolver]
})
export class BlockModule {}
