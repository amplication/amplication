import { PrismaService } from '../../prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthServiceBase {
  constructor(protected readonly prisma: PrismaService) {}
  async isDbReady(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      return false;
    }
  }
}
