import { Module } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
