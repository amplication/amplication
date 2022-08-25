import { forwardRef, Module } from '@nestjs/common';
import { PrismaModule, PrismaService } from '@amplication/prisma-db';
import { ResourceModule } from '../resource/resource.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { GitResolver } from './git.resolver';
import {
  GitModule,
  GitService,
  GithubService,
  GitServiceFactory
} from '@amplication/git-service';
import { GitProviderService } from './git.provider.service';
@Module({
  imports: [
    PermissionsModule,
    forwardRef(() => ResourceModule),
    PrismaModule,
    GitModule
  ],
  providers: [
    GitProviderService,
    GitResolver,
    GitService,
    GithubService,
    PrismaService,
    GitServiceFactory
  ]
})
export class GitProviderModule {}
