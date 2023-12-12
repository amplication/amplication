import * as CodeGenTypes from "@amplication/code-gen-types";
import {
  getDefaultActionsForEntity,
  getDefaultActionsForRelationField,
} from "@amplication/dsg-utils";
import { Inject, Injectable } from "@nestjs/common";
import { UserEntity } from "../../decorators/user.decorator";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { AmplicationError } from "../../errors/AmplicationError";
import { Entity, EntityField, User } from "../../models";
import { PrismaService } from "../../prisma";
import { BlockService } from "../block/block.service";
import { BlockTypeService } from "../block/blockType.service";
import { Module } from "../module/dto/Module";
import { CreateModuleActionArgs } from "./dto/CreateModuleActionArgs";
import { DeleteModuleActionArgs } from "./dto/DeleteModuleActionArgs";
import { EnumModuleActionType } from "./dto/EnumModuleActionType";
import { FindManyModuleActionArgs } from "./dto/FindManyModuleActionArgs";
import { ModuleAction } from "./dto/ModuleAction";
import { UpdateModuleActionArgs } from "./dto/UpdateModuleActionArgs";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";

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
    private readonly prisma: PrismaService,
    @Inject(AmplicationLogger)
    private readonly logger: AmplicationLogger
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

    if (existingAction.actionType !== EnumModuleActionType.Custom) {
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

    if (moduleAction?.actionType !== EnumModuleActionType.Custom) {
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

  //call this function when the entity names changes, and we need to update the default actions
  async updateDefaultActionsForEntityModule(
    entity: Entity,
    module: Module,
    user: User
  ): Promise<ModuleAction[]> {
    //get the updated default actions (with updated names)
    const defaultActions = await getDefaultActionsForEntity(
      entity as unknown as CodeGenTypes.Entity
    );

    //get the current default actions
    const existingDefaultActions = await this.findManyBySettings(
      {
        where: {
          parentBlock: {
            id: module.id,
          },
        },
      },
      {
        path: ["actionType"],
        not: EnumModuleActionType.Custom,
      }
    );

    return await Promise.all(
      existingDefaultActions.map((action) => {
        return (
          defaultActions[action.actionType] &&
          super.update(
            {
              where: {
                id: action.id,
              },
              data: {
                name: defaultActions[action.actionType].name,
                displayName: defaultActions[action.actionType].displayName,
                description: defaultActions[action.actionType].description,
                enabled: action.enabled,
                gqlOperation: defaultActions[action.actionType].gqlOperation,
                restVerb: defaultActions[action.actionType].restVerb,
                path: defaultActions[action.actionType].path,
              },
            },
            user
          )
        );
      })
    );
  }

  async createDefaultActionsForRelationField(
    entity: Entity,
    field: EntityField,
    moduleId: string,
    user: User
  ): Promise<ModuleAction[]> {
    const defaultActions = await getDefaultActionsForRelationField(
      entity as unknown as CodeGenTypes.Entity,
      field as unknown as CodeGenTypes.EntityField
    );
    return await Promise.all(
      Object.keys(defaultActions).map((action) => {
        try {
          return (
            defaultActions[action] &&
            super.create(
              {
                data: {
                  fieldPermanentId: field.permanentId,
                  ...defaultActions[action],
                  parentBlock: {
                    connect: {
                      id: moduleId,
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
        } catch (error) {
          this.logger.error(`${error.message} entityId: ${entity.id}`);
          return;
        }
      })
    );
  }

  async updateDefaultActionsForRelationField(
    entity: Entity,
    field: EntityField,
    moduleId: string,
    user: User
  ): Promise<ModuleAction[]> {
    const defaultActions = await getDefaultActionsForRelationField(
      entity as unknown as CodeGenTypes.Entity,
      field as unknown as CodeGenTypes.EntityField
    );

    //get the current default actions
    const existingDefaultActions = await this.findManyBySettings(
      {
        where: {
          parentBlock: {
            id: moduleId,
          },
        },
      },
      {
        path: ["fieldPermanentId"],
        equals: field.permanentId,
      }
    );

    return await Promise.all(
      existingDefaultActions.map((action) => {
        return (
          defaultActions[action.actionType] &&
          super.update(
            {
              where: {
                id: action.id,
              },
              data: {
                name: defaultActions[action.actionType].name,
                displayName: defaultActions[action.actionType].displayName,
                description: defaultActions[action.actionType].description,
                enabled: action.enabled,
                gqlOperation: defaultActions[action.actionType].gqlOperation,
                restVerb: defaultActions[action.actionType].restVerb,
                path: defaultActions[action.actionType].path,
              },
            },
            user
          )
        );
      })
    );
  }

  async deleteDefaultActionsForRelationField(
    field: EntityField,
    moduleId: string,
    user: User
  ): Promise<Module[]> {
    //get the current default actions
    const existingDefaultActions = await this.findManyBySettings(
      {
        where: {
          parentBlock: {
            id: moduleId,
          },
        },
      },
      {
        path: ["fieldPermanentId"],
        equals: field.permanentId,
      }
    );

    return await Promise.all(
      existingDefaultActions.map((action) =>
        super.delete(
          {
            where: {
              id: action.id,
            },
          },
          user,
          true
        )
      )
    );
  }
}
