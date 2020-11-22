import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { CommitResolver } from './commit.resolver';
import { CommitService } from './commit.service';

@Module({
  imports: [PrismaModule],
  providers: [CommitService, CommitResolver],
  exports: [CommitService, CommitResolver]
})
export class CommitModule {}
