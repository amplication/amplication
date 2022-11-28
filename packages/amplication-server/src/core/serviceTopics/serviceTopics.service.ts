import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { BlockTypeService } from "../block/blockType.service";
import { CreateServiceTopicsArgs } from "./dto/CreateServiceTopicsArgs";
import { FindManyServiceTopicsArgs } from "./dto/FindManyServiceTopicsArgs";
import { ServiceTopics } from "./dto/ServiceTopics";
import { UpdateServiceTopicsArgs } from "./dto/UpdateServiceTopicsArgs";
import { User } from "../../models";
import { ResourceService } from "../resource/resource.service";
import { EnumResourceType } from "../resource/dto/EnumResourceType";
import { AmplicationError } from "../../errors/AmplicationError";
import { BlockService } from "../block/block.service";
import { DeleteServiceTopicsArgs } from "./dto/DeleteServiceTopicsArgs";
import {
  EnumMessagePatternConnectionOptions,
  MessagePatternCreateInput,
} from "@amplication/code-gen-types/models";

@Injectable()
export class ServiceTopicsService extends BlockTypeService<
  ServiceTopics,
  FindManyServiceTopicsArgs,
  CreateServiceTopicsArgs,
  UpdateServiceTopicsArgs,
  DeleteServiceTopicsArgs
> {
  blockType = EnumBlockType.ServiceTopics;

  constructor(
    @Inject(forwardRef(() => ResourceService))
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
        id: resourceId,
      },
    });

    const broker = await this.resourceService.resources({
      where: {
        project: {
          id: resource.projectId,
        },
        id: messageBrokerId,
        resourceType: {
          equals: EnumResourceType.MessageBroker,
        },
      },
    });

    if (!broker.length) {
      throw new AmplicationError(
        `Cannot find a resource of type "MessageBroker" with ID ${messageBrokerId}`
      );
    }
  }

  async create(
    args: CreateServiceTopicsArgs,
    user: User
  ): Promise<ServiceTopics> {
    await this.validateConnectedResource(
      args.data.resource.connect.id,
      args.data.messageBrokerId
    );

    const serviceTopicList = await this.blockService.findManyByBlockType(
      { where: { resource: { id: args.data.messageBrokerId } } },
      EnumBlockType.Topic
    );

    const patterns: MessagePatternCreateInput[] = [];

    serviceTopicList.forEach((topic) => {
      const pattern = {
        type: EnumMessagePatternConnectionOptions.None,
        topicId: topic.id,
      };
      patterns.push(pattern);
    });

    args.data.patterns = patterns;

    return super.create(args, user);
  }

  async update(
    args: UpdateServiceTopicsArgs,
    user: User
  ): Promise<ServiceTopics> {
    const block = await this.blockService.findOne({
      where: args.where,
    });

    await this.validateConnectedResource(
      block.resourceId,
      args.data.messageBrokerId
    );

    return super.update(args, user);
  }

  async removeTopicFromAllServices(topicId: string, user: User): Promise<void> {
    const serviceTopicList =
      await this.blockService.findManyByBlockType<ServiceTopics>(
        {},
        EnumBlockType.ServiceTopics
      );
    serviceTopicList.forEach(async (serviceTopics) => {
      const topicToRemove = serviceTopics.patterns.findIndex(
        (topic) => topic.topicId === topicId
      );
      if (topicToRemove === -1) return;

      serviceTopics.patterns.splice(topicToRemove, 1);

      const updatePatterns: MessagePatternCreateInput[] = [];
      serviceTopics.patterns.forEach((pattern) => {
        updatePatterns.push({ type: pattern.type, topicId: pattern.topicId });
      });

      await this.update(
        {
          data: {
            patterns: updatePatterns,
            messageBrokerId: serviceTopics.messageBrokerId,
            enabled: true,
          },
          where: {
            id: serviceTopics.id,
          },
        },
        user
      );
    });
    return;
  }
}
