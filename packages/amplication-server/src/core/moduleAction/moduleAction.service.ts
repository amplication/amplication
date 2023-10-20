import { Injectable } from "@nestjs/common";
import { UserEntity } from "../../decorators/user.decorator";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { Entity, User } from "../../models";
import { BlockService } from "../block/block.service";
import { BlockTypeService } from "../block/blockType.service";
import { CreateModuleActionArgs } from "./dto/CreateModuleActionArgs";
import { DeleteModuleActionArgs } from "./dto/DeleteModuleActionArgs";
import { FindManyModuleActionArgs } from "./dto/FindManyModuleActionArgs";
import { ModuleAction } from "./dto/ModuleAction";
import { UpdateModuleActionArgs } from "./dto/UpdateModuleActionArgs";
import { ModuleActionUpdateInput } from "./dto/ModuleActionUpdateInput";
import { PrismaService } from "../../prisma";
import { pascalCase } from "pascal-case";
import { Module } from "../module/dto/Module";
import { getDefaultActionsForEntity } from "libs/util/dsg-utils/src";
import { AmplicationError } from "../../errors/AmplicationError";
import { EnumModuleActionType } from "./dto/EnumModuleActionType";
import * as CodeGenTypes from "@amplication/code-gen-types";

const DEFAULT_MODULE_DESCRIPTION =
  "This module was automatically created as the default module for an entity";

type ModuleActionData = Pick<
  ModuleAction,
  | "description"
  | "displayName"
  | "enabled"
  | "isDefault"
  | "name"
  | "actionType"
>;

@Injectable()
export class ModuleActionService extends BlockTypeService<
  ModuleAction,
  FindManyModuleActionArgs,
  CreateModuleActionArgs,
  UpdateModuleActionArgs,
  DeleteModuleActionArgs
> {
  blockType = EnumBlockType.ModuleAction;

  constructor(
    protected readonly blockService: BlockService,
    private readonly prisma: PrismaService
  ) {
    super(blockService);
  }

  validateModuleActionName(moduleActionName: string): void {
    const regex = /^[a-zA-Z0-9._-]{1,249}$/;
    if (!regex.test(moduleActionName)) {
      throw new AmplicationError("Invalid moduleAction name");
    }
  }

  async create(
    args: CreateModuleActionArgs,
    user: User
  ): Promise<ModuleAction> {
    this.validateModuleActionName(args.data.name);

    return super.create(
      {
        ...args,
        data: {
          ...args.data,
          enabled: true,
          isDefault: false,
          type: EnumModuleActionType.Custom,
        },
      },
      user
    );
  }

  async update(
    args: UpdateModuleActionArgs,
    user: User
  ): Promise<ModuleAction> {
    //todo: validate that only the enabled field can be updated for default actions
    this.validateModuleActionName(args.data.name);

    const existingAction = await super.findOne({
      where: { id: args.where.id },
    });

    if (!existingAction) {
      throw new AmplicationError(
        `Module Action not found, ID: ${args.where.id}`
      );
    }

    if (existingAction.isDefault) {
      if (existingAction.name !== args.data.name) {
        throw new AmplicationError(
          "Cannot update the name of a default Action for entity."
        );
      }
    }

    return super.update(args, user);
  }

  async delete(
    args: DeleteModuleActionArgs,
    @UserEntity() user: User
  ): Promise<ModuleAction> {
    const moduleAction = await super.findOne(args);

    if (moduleAction?.isDefault) {
      throw new AmplicationError(
        "Cannot delete a default Action for entity. To delete it, you must delete the entity"
      );
    }
    return super.delete(args, user);
  }

  async createDefaultActionsForEntityModule(
    entity: Entity,
    module: Module,
    user: User
  ): Promise<ModuleAction[]> {
    const defaultActions = await getDefaultActionsForEntity(
      entity as unknown as CodeGenTypes.Entity
    );
    return await Promise.all(
      Object.keys(defaultActions).map((action) => {
        return (
          defaultActions[action] &&
          super.create(
            {
              data: {
                ...defaultActions[action],
                parentBlock: {
                  connect: {
                    id: module.id,
                  },
                },
                resource: {
                  connect: {
                    id: entity.resourceId,
                  },
                },
              },
            },
            user
          )
        );
      })
    );
  }
}
