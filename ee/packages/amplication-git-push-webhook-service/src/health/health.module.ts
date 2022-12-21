import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

@Module({
  controllers: [HealthController],
  providers: [HealthService, PrismaService],
  exports: [HealthService],
})
export class HealthModule {}
