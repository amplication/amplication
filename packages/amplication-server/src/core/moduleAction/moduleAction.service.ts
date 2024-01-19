import * as CodeGenTypes from "@amplication/code-gen-types";
import {
  getDefaultActionsForEntity,
  getDefaultActionsForRelationField,
} from "@amplication/dsg-utils";
import { Injectable } from "@nestjs/common";
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
import { kebabCase } from "lodash";
import { EnumModuleDtoPropertyType } from "../moduleDto/dto/propertyTypes/EnumModuleDtoPropertyType";

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
          actionType: EnumModuleActionType.Custom,
          enabled: true,
          gqlOperation: CodeGenTypes.EnumModuleActionGqlOperation.Query,
          restVerb: CodeGenTypes.EnumModuleActionRestVerb.Get,
          path: `/:id/${kebabCase(args.data.name)}`,
          outputType: {
            type: EnumModuleDtoPropertyType.Dto,
            dtoId: "",
            isArray: false,
          },
          inputType: {
            type: EnumModuleDtoPropertyType.Dto,
            dtoId: "",
            isArray: false,
          },
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
      if (
        existingAction.name !== args.data.name &&
        args.data.name !== undefined
      ) {
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
                inputType: defaultActions[action.actionType].inputType,
                outputType: defaultActions[action.actionType].outputType,
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

    const defaultActionKeysSet = new Set(Object.keys(defaultActions));
    const existingDefaultActionKeysSet = new Set(
      existingDefaultActions.map((action) => action.actionType) as string[]
    );

    const actionsToDelete: EnumModuleActionType[] = [];
    const actionsToCreate: EnumModuleActionType[] = [];
    const actionsToUpdate: EnumModuleActionType[] = [];

    // Iterate through once and categorize actions
    for (const action of defaultActionKeysSet) {
      if (!existingDefaultActionKeysSet.has(action)) {
        actionsToCreate.push(action as EnumModuleActionType);
      } else {
        actionsToUpdate.push(action as EnumModuleActionType);
      }
    }

    for (const action of existingDefaultActionKeysSet) {
      if (!defaultActionKeysSet.has(action)) {
        actionsToDelete.push(action as EnumModuleActionType);
      }
    }

    const created = Promise.all(
      actionsToCreate.map((action) => {
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
      })
    );

    const deleted = Promise.all(
      actionsToDelete.map((actionType) => {
        const actionToDelete = existingDefaultActions.find(
          (existing) => existing.actionType === actionType
        );

        return super.delete(
          {
            where: {
              id: actionToDelete.id,
            },
          },
          user,
          true
        );
      })
    );

    const updated = Promise.all(
      actionsToUpdate.map((action) => {
        const actionToUpdate = existingDefaultActions.find(
          (existing) => existing.actionType === action
        );

        return super.update(
          {
            where: {
              id: actionToUpdate.id,
            },
            data: {
              name: defaultActions[action].name,
              displayName: defaultActions[action].displayName,
              description: defaultActions[action].description,
              enabled: actionToUpdate.enabled,
              gqlOperation: defaultActions[action].gqlOperation,
              restVerb: defaultActions[action].restVerb,
              path: defaultActions[action].path,
              inputType: defaultActions[action].inputType,
              outputType: defaultActions[action].outputType,
            },
          },
          user
        );
      })
    );

    await Promise.all([created, deleted, updated]);

    return [...(await created), ...(await updated)];
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
