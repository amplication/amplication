import { Module } from '@nestjs/common';
import { EntityPageService } from './entityPage.service';
import { EntityPageResolver } from './entityPage.resolver';
import { BlockModule } from '../block/block.module';

@Module({
  imports: [BlockModule],
  providers: [EntityPageService, EntityPageResolver],
  exports: [EntityPageService, EntityPageResolver]
})
export class EntityPageModule {}
