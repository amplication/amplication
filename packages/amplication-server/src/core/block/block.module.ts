import { Module } from '@nestjs/common';
import { BlockService } from './block.service';
import { BlockResolver } from './block.resolver';
import { PrismaModule } from 'src/services/prisma.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [PrismaModule, PermissionsModule],
  providers: [BlockService, BlockResolver],
  exports: [BlockService, BlockResolver]
})
export class BlockModule {}
