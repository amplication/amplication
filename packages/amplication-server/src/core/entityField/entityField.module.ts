import { Module } from '@nestjs/common';
import { EntityFieldService } from './entityField.service';
import { EntityFieldResolver } from './EntityFieldResolver';
import { PrismaModule } from '../../services/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [EntityFieldService, EntityFieldResolver],
  exports: [EntityFieldService, EntityFieldResolver]
})
export class EntityFieldModule {}
