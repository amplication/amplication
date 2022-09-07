import { Injectable } from '@nestjs/common';
import { EnumBlockType } from 'src/enums/EnumBlockType';
import { BlockTypeService } from '../block/blockType.service';
import { CreateServiceMessageBrokerConnectionArgs } from './dto/CreateServiceMessageBrokerConnectionArgs';
import { FindManyServiceMessageBrokerConnectionArgs } from './dto/FindManyServiceMessageBrokerConnectionArgs';
import { ServiceMessageBrokerConnection } from './dto/ServiceMessageBrokerConnection';
import { UpdateServiceMessageBrokerConnectionArgs } from './dto/UpdateServiceMessageBrokerConnectionArgs';
import { User } from '../../models';
import { ResourceService } from '../resource/resource.service';
import { EnumResourceType } from '../resource/dto/EnumResourceType';
import { AmplicationError } from 'src/errors/AmplicationError';
import { BlockService } from '../block/block.service';

@Injectable()
export class ServiceMessageBrokerConnectionService extends BlockTypeService<
  ServiceMessageBrokerConnection,
  FindManyServiceMessageBrokerConnectionArgs,
  CreateServiceMessageBrokerConnectionArgs,
  UpdateServiceMessageBrokerConnectionArgs
> {
  blockType = EnumBlockType.ServiceMessageBrokerConnection;

  constructor(
    private resourceService: ResourceService,
    protected readonly blockService: BlockService
  ) {
    super(blockService);
  }

  //check if the connected message broker is a resource of type "MessageBroker" in the current project
  private async validateConnectedResource(
    resourceId: string,
    messageBrokerId: string
  ) {
    const resource = await this.resourceService.resource({
      where: {
        id: resourceId
      }
    });

    const broker = await this.resourceService.resources({
      where: {
        project: {
          id: resource.projectId
        },
        id: messageBrokerId,
        resourceType: {
          equals: EnumResourceType.MessageBroker
        }
      }
    });

    if (!broker.length) {
      throw new AmplicationError(
        `Cannot find a resource of type "MessageBroker" with ID ${messageBrokerId}`
      );
    }
  }

  async create(
    args: CreateServiceMessageBrokerConnectionArgs,
    user: User
  ): Promise<ServiceMessageBrokerConnection> {
    await this.validateConnectedResource(
      args.data.resource.connect.id,
      args.data.messageBrokerId
    );

    return super.create(args, user);
  }

  async update(
    args: UpdateServiceMessageBrokerConnectionArgs,
    user: User
  ): Promise<ServiceMessageBrokerConnection> {
    const block = await this.blockService.findOne({
      where: args.where
    });

    await this.validateConnectedResource(
      block.resourceId,
      args.data.messageBrokerId
    );

    return super.update(args, user);
  }
}
