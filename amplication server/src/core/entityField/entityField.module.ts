import { Module } from '@nestjs/common';
import { EntityFieldService } from './entityField.service';
import { PrismaModule } from '../../services/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EntityFieldService],
  exports: [EntityFieldService]
})
export class EntityFieldModule {}
