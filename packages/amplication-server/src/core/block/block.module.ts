import { Module } from '@nestjs/common';
import { BlockService } from './block.service';
import { PrismaModule } from 'src/services/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [BlockService],
  exports: [BlockService]
})
export class BlockModule {}
