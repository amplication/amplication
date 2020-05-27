import { Module } from '@nestjs/common';
import { EntityService } from './entity.service';
import { EntityResolver } from './EntityResolver';
import { PrismaModule } from '../../services/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EntityService, EntityResolver],
  exports: [EntityService, EntityResolver]
})
export class EntityModule {}
