import { Module } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { ConfigModule } from '@nestjs/config';
import { GithubResolver } from './github.resolver';
import { GithubService } from './github.service';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [PrismaModule, ConfigModule, PermissionsModule],
  providers: [GithubService, GithubResolver],
  exports: [GithubService, GithubResolver]
})
export class GithubModule {}
