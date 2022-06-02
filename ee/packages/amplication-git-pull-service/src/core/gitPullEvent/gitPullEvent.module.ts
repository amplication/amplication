import { Module } from '@nestjs/common';
import { GitPullEventService } from './gitPullEvent.service';
import { GitPullEventController } from './gitPullEvent.controller';
import { PrismaModule } from 'nestjs-prisma';
import { GitPullEventRepository } from '../../repositories/gitPullEvent.repository';
import { StorageService } from '../../providers/storage/storage.service';
import { GitHostProviderService } from '../../providers/gitProvider/gitHostProvider.service';
import { GitClientService } from '../../providers/gitClient/gitClient.service';
import { GitHostProviderFactory } from '../../utils/gitHostProviderFactory/gitHostProviderFactory';

@Module({
  imports: [PrismaModule],
  controllers: [GitPullEventController],
  providers: [
    GitPullEventService,
    GitHostProviderService,
    {
      provide: 'IGitHostProviderFactory',
      useClass: GitHostProviderFactory,
    },
    {
      provide: 'IGitClient',
      useClass: GitClientService,
    },
    {
      provide: 'IGitPullEventRepository',
      useClass: GitPullEventRepository,
    },
    {
      provide: 'IStorage',
      useClass: StorageService,
    },
  ],
  exports: [GitPullEventService, PrismaModule],
})
export class GitPullEventModule {}
