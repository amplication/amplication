import { Injectable } from "@nestjs/common";
import { UserEntity } from "../../decorators/user.decorator";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { User } from "../../models";
import { BlockService } from "../block/block.service";
import { BlockTypeService } from "../block/blockType.service";
import { CreateTopicArgs } from "./dto/CreateTopicArgs";
import { FindManyTopicArgs } from "./dto/FindManyTopicArgs";
import { Topic } from "./dto/Topic";
import { UpdateTopicArgs } from "./dto/UpdateTopicArgs";

@Injectable()
export class TopicService extends BlockTypeService<
  Topic,
  FindManyTopicArgs,
  CreateTopicArgs,
  UpdateTopicArgs
> {
  blockType = EnumBlockType.Topic;

  constructor(protected readonly blockService: BlockService) {
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
}
