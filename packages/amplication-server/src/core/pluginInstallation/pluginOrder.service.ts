import { Injectable } from "@nestjs/common";
import { FindOneArgs } from "../../dto";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { BlockService } from "../block/block.service";
import { BlockTypeService } from "../block/blockType.service";
import { CreatePluginOrderArgs } from "./dto/CreatePluginOrderArgs";
import { DeletePluginOrderArgs } from "./dto/DeletePluginOrderArgs";
import { FindManyPluginOrderArgs } from "./dto/FindManyPluginOrderArgs";
import { PluginOrder } from "./dto/PluginOrder";
import { UpdatePluginOrderArgs } from "./dto/UpdatePluginOrderArgs";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";

@Injectable()
export class PluginOrderService extends BlockTypeService<
  PluginOrder,
  FindManyPluginOrderArgs,
  CreatePluginOrderArgs,
  UpdatePluginOrderArgs,
  DeletePluginOrderArgs
> {
  blockType = EnumBlockType.PluginOrder;

  constructor(
    protected readonly blockService: BlockService,
    protected readonly logger: AmplicationLogger
  ) {
    super(blockService, logger);
  }

  async findByResourceId(args: FindOneArgs): Promise<PluginOrder | null> {
    const [pluginOrder] = await super.findMany({
      where: {
        resource: {
          id: args.where.id,
        },
      },
    });

    return pluginOrder;
  }
}
