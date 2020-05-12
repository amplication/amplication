import { Module } from '@nestjs/common';
import { EntityVersionService } from './entityVersion.service';
import { PrismaModule } from '../../services/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EntityVersionService],
  exports: [EntityVersionService]
})
export class EntityVersionModule {}
