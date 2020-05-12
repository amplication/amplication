import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { PrismaModule } from '../../services/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AppService],
  exports: [AppService]
})
export class AppModule {}
