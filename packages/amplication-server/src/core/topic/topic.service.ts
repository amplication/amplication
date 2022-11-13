import { Injectable } from "@nestjs/common";
import { UserEntity } from "../../decorators/user.decorator";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { User } from "../../models";
import { BlockService } from "../block/block.service";
import { BlockTypeService } from "../block/blockType.service";
import { ServiceTopicsService } from "../serviceTopics/serviceTopics.service";
import { CreateTopicArgs } from "./dto/CreateTopicArgs";
import { DeleteTopicArgs } from "./dto/DeleteTopicArgs";
import { FindManyTopicArgs } from "./dto/FindManyTopicArgs";
import { Topic } from "./dto/Topic";
import { UpdateTopicArgs } from "./dto/UpdateTopicArgs";

@Injectable()
export class TopicService extends BlockTypeService<
  Topic,
  FindManyTopicArgs,
  CreateTopicArgs,
  UpdateTopicArgs,
  DeleteTopicArgs
> {
  blockType = EnumBlockType.Topic;

  constructor(
    protected readonly blockService: BlockService,
    protected readonly serviceTopics: ServiceTopicsService
  ) {
    super(blockService);
  }

  async create(
    args: CreateTopicArgs,
    @UserEntity() user: User
  ): Promise<Topic> {
    const regex = /^[a-zA-Z0-9._-]{1,249}$/;
    if (!regex.test(args.data.name)) {
      throw new Error("Invalid name");
    }
    return super.create(args, user);
  }

  async delete(
    args: DeleteTopicArgs,
    @UserEntity() user: User
  ): Promise<Topic> {
    const topicId = args.where.id;
    await this.serviceTopics.removeTopicFromAllServices(topicId, user);
    return super.delete(args, user);
  }
}
