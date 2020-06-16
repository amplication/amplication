import { Module } from '@nestjs/common';
import { EntityPageService } from './entityPage.service';
import { EntityPageResolver } from './entityPage.resolver';
import { BlockModule } from '../block/block.module';
import { EntityModule } from 'src/core/entity/entity.module';

@Module({
  imports: [BlockModule, EntityModule],
  providers: [EntityPageService, EntityPageResolver],
  exports: [EntityPageService, EntityPageResolver]
})
export class EntityPageModule {}
