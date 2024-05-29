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
import { EnumModuleActionGqlOperation } from "./dto/EnumModuleActionGqlOperation";
import { EnumModuleActionRestVerb } from "./dto/EnumModuleActionRestVerb";
import { ConfigService } from "@nestjs/config";
import { Env } from "../../env";
import { BillingService } from "../billing/billing.service";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { validateCustomActionsEntitlement } from "../block/block.util";
import { EnumEventType } from "../../services/segmentAnalytics/segmentAnalyticsEventType.types";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import { ModuleDtoService } from "../moduleDto/moduleDto.service";

const UNSUPPORTED_TYPES = [
  EnumModuleDtoPropertyType.Null,
  EnumModuleDtoPropertyType.Undefined,
  EnumModuleDtoPropertyType.Json,
];

@Injectable()
export class ModuleActionService extends BlockTypeService<
  ModuleAction,
  FindManyModuleActionArgs,
  CreateModuleActionArgs,
  UpdateModuleActionArgs,
  DeleteModuleActionArgs
> {
  blockType = EnumBlockType.ModuleAction;

  customActionsEnabled: boolean;

  constructor(
    protected readonly blockService: BlockService,
    protected readonly billingService: BillingService,
    protected readonly logger: AmplicationLogger,
    protected readonly analytics: SegmentAnalyticsService,
    private readonly prisma: PrismaService,
    private configService: ConfigService,
    private readonly moduleDtoService: ModuleDtoService
  ) {
    super(blockService, logger);

    this.customActionsEnabled = Boolean(
      this.configService.get<string>(Env.FEATURE_CUSTOM_ACTIONS_ENABLED) ===
        "true"
    );
  }

  async findMany(
    args: FindManyModuleActionArgs,
    user?: User
  ): Promise<ModuleAction[]> {
    const { includeCustomActions, includeDefaultActions, ...rest } =
      args.where || {};

    const prismaArgs = {
      ...args,
      where: {
        ...rest,
      },
    };

    //when undefined the default value is true
    const includeCustomActionsBoolean = includeCustomActions !== false;
    const includeDefaultActionsBoolean = includeDefaultActions !== false;

    if (includeCustomActionsBoolean && includeDefaultActionsBoolean) {
      return super.findMany(prismaArgs);
    } else if (includeCustomActionsBoolean) {
      return super.findManyBySettings(prismaArgs, [
        {
          path: ["actionType"],
          equals: EnumModuleActionType.Custom,
        },
      ]);
    } else if (includeDefaultActionsBoolean) {
      return super.findManyBySettings(prismaArgs, [
        {
          path: ["actionType"],
          not: EnumModuleActionType.Custom,
        },
      ]);
    } else {
      return [];
    }
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
    await validateCustomActionsEntitlement(
      user.workspace?.id,
      this.billingService,
      this.logger
    );

    this.validateModuleActionName(args.data.name);

    if (!this.customActionsEnabled) {
      return null;
    }

    const subscription = await this.billingService.getSubscription(
      user.workspace?.id
    );

    await this.analytics.trackWithContext({
      properties: {
        actionParameters: args.data,
        planType: subscription.subscriptionPlan,
      },
      event: EnumEventType.CreateUserAction,
    });

    return super.create(
      {
        ...args,
        data: {
          ...args.data,
          actionType: EnumModuleActionType.Custom,
          enabled: true,
          gqlOperation: EnumModuleActionGqlOperation.Query,
          restVerb: EnumModuleActionRestVerb.Get,
          path: `/:id/${kebabCase(args.data.name)}`,
          outputType: {
            type: EnumModuleDtoPropertyType.String,
            dtoId: "",
            isArray: false,
          },
          inputType: {
            type: EnumModuleDtoPropertyType.String,
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
    await validateCustomActionsEntitlement(
      user.workspace?.id,
      this.billingService,
      this.logger
    );
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
      if (args.data.inputType !== undefined) {
        throw new AmplicationError(
          "Cannot update the input type of a default Action for entity."
        );
      }

      if (args.data.outputType !== undefined) {
        throw new AmplicationError(
          "Cannot update the output type of a default Action for entity."
        );
      }
    } else {
      if (args.data.inputType && args.data.outputType)
        await this.moduleDtoService.validateTypes(
          existingAction.resourceId,
          [args.data.inputType, args.data.outputType],
          UNSUPPORTED_TYPES
        );
    }

    const subscription = await this.billingService.getSubscription(
      user.workspace?.id
    );

    await this.analytics.trackWithContext({
      properties: {
        actionParameters: args.data,
        operation: "edit",
        planType: subscription.subscriptionPlan,
      },
      event:
        existingAction.actionType === EnumModuleActionType.Custom
          ? EnumEventType.InteractUserAction
          : EnumEventType.InteractAmplicationAction,
    });

    return super.update(args, user);
  }

  async delete(
    args: DeleteModuleActionArgs,
    @UserEntity() user: User
  ): Promise<ModuleAction> {
    await validateCustomActionsEntitlement(
      user.workspace?.id,
      this.billingService,
      this.logger
    );
    const moduleAction = await super.findOne(args);

    if (moduleAction?.actionType !== EnumModuleActionType.Custom) {
      throw new AmplicationError(
        "Cannot delete a default Action for entity. To delete it, you must delete the entity"
      );
    }

    const subscription = await this.billingService.getSubscription(
      user.workspace?.id
    );

    await this.analytics.trackWithContext({
      properties: {
        name: moduleAction.name,
        operation: "delete",
        planType: subscription.subscriptionPlan,
      },
      event: EnumEventType.InteractUserAction,
    });
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
