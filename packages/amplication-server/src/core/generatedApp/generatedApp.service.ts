import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { QUEUE_NAME } from './constants';
import { AppGenerationRequest } from './dto/AppGenerationRequest';
import { GeneratedAppCreateInput } from './dto/GeneratedAppCreateInput';
import { EntityService } from '../entity/entity.service';

@Injectable()
export class GeneratedAppService {
  constructor(
    private readonly entityService: EntityService,
    @InjectQueue(QUEUE_NAME) private queue: Queue<AppGenerationRequest>
  ) {}
  async create(args: GeneratedAppCreateInput): Promise<void> {
    const entities = await this.entityService.entities({ where: args });
    await this.queue.add({ entities });
  }
}
