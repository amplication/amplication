import { Module } from '@nestjs/common';
import { PrismaService } from '@amplication/prisma-db';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
