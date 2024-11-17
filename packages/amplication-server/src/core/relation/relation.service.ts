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
import { UpdateResourceRelationArgs } from "./dto/UpdateResourceRelationArgs";
import { User } from "../../models";

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

  async updateResourceRelation(
    args: UpdateResourceRelationArgs,
    user: User
  ): Promise<Relation> {
    const { relationKey } = args.data;

    const existingRelation = await super.findManyBySettings(
      {
        where: {
          resource: {
            id: args.resource.id,
          },
        },
      },
      [
        {
          path: ["relationKey"],
          equals: relationKey,
        },
      ]
    );

    if (!existingRelation || existingRelation.length === 0) {
      const createArgs: CreateRelationArgs = {
        data: {
          ...args.data,
          displayName: args.data.relationKey,
          resource: {
            connect: {
              id: args.resource.id,
            },
          },
        },
      };

      const results = await super.create(createArgs, user);
      return results;
    } else {
      const updateArgs: UpdateRelationArgs = {
        where: {
          id: existingRelation[0].id,
        },
        data: {
          ...args.data,
          displayName: args.data.relationKey,
        },
      };

      const results = await super.update(updateArgs, user);
      return results;
    }
  }
}
