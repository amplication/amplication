import { Module } from '@nestjs/common';
import { EntityService } from './entity.service';
import { PrismaModule } from '../../services/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EntityService],
  exports: [EntityService]
})
export class EntityModule {}
