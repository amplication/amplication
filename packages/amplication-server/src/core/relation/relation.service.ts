import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Injectable } from "@nestjs/common";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { BlockService } from "../block/block.service";
import { BlockTypeService } from "../block/blockType.service";
import { CreateRelationArgs } from "./dto/CreateRelationArgs";
import { DeleteRelationArgs } from "./dto/DeleteRelationArgs";
import { FindManyRelationArgs } from "./dto/FindManyRelationArgs";
import { Relation } from "./dto/Relation";
import { UpdateRelationArgs } from "./dto/UpdateRelationArgs";

@Injectable()
export class RelationService extends BlockTypeService<
  Relation,
  FindManyRelationArgs,
  CreateRelationArgs,
  UpdateRelationArgs,
  DeleteRelationArgs
> {
  blockType = EnumBlockType.Relation;

  constructor(
    protected readonly blockService: BlockService,
    protected readonly logger: AmplicationLogger
  ) {
    super(blockService, logger);
  }
}
