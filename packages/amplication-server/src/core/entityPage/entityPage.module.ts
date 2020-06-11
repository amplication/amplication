import { Module } from '@nestjs/common';
import { EntityPageService } from './EntityPage.service';
import { EntityPageResolver } from './EntityPage.resolver';
import { PrismaModule } from 'src/services/prisma.module';
import { BlockModule } from '../block/block.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [PrismaModule, BlockModule, PermissionsModule],
  providers: [EntityPageService, EntityPageResolver],
  exports: [EntityPageService, EntityPageResolver]
})
export class EntityPageModule {}
