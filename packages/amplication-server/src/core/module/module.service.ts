import { Injectable } from "@nestjs/common";
import { UserEntity } from "../../decorators/user.decorator";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { AmplicationError } from "../../errors/AmplicationError";
import { Entity, User } from "../../models";
import { BlockService } from "../block/block.service";
import { BlockTypeService } from "../block/blockType.service";
import { ModuleActionService } from "../moduleAction/moduleAction.service";
import { ModuleDtoService } from "../moduleDto/moduleDto.service";
import { DefaultModuleForEntityNotFoundError } from "./DefaultModuleForEntityNotFoundError";
import { CreateModuleArgs } from "./dto/CreateModuleArgs";
import { DeleteModuleArgs } from "./dto/DeleteModuleArgs";
import { FindManyModuleArgs } from "./dto/FindManyModuleArgs";
import { Module } from "./dto/Module";
import { ModuleUpdateInput } from "./dto/ModuleUpdateInput";
import { UpdateModuleArgs } from "./dto/UpdateModuleArgs";
import { ConfigService } from "@nestjs/config";
import { Env } from "../../env";
import { BillingService } from "../billing/billing.service";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import { EnumEventType } from "../../services/segmentAnalytics/segmentAnalyticsEventType.types";
import {
  EnumModuleActionType,
  EnumModuleDtoPropertyType,
  EnumModuleDtoType,
} from "@amplication/code-gen-types";
import { validateCustomActionsEntitlement } from "../block/block.util";
import { isReservedName } from "../entity/reservedNames";
const DEFAULT_MODULE_DESCRIPTION =
  "This module was automatically created as the default module for an entity";

@Injectable()
export class ModuleService extends BlockTypeService<
  Module,
  FindManyModuleArgs,
  CreateModuleArgs,
  UpdateModuleArgs,
  DeleteModuleArgs
> {
  blockType = EnumBlockType.Module;

  customActionsEnabled: boolean;

  constructor(
    protected readonly blockService: BlockService,
    protected readonly billingService: BillingService,
    protected readonly logger: AmplicationLogger,
    protected readonly analytics: SegmentAnalyticsService,
    private readonly moduleActionService: ModuleActionService,
    private readonly moduleDtoService: ModuleDtoService,
    private configService: ConfigService
  ) {
    super(blockService, logger);

    this.customActionsEnabled = Boolean(
      this.configService.get<string>(Env.FEATURE_CUSTOM_ACTIONS_ENABLED) ===
        "true"
    );
  }

  validateModuleName(moduleName: string): void {
    const regex = /^[a-zA-Z0-9._-]{1,249}$/;
    if (!regex.test(moduleName)) {
      throw new AmplicationError(`Invalid module name: ${moduleName}`);
    }

    if (isReservedName(moduleName)) {
      throw new AmplicationError(
        `Module name ${moduleName} is reserved and cannot be used.`
      );
    }
  }

  async findMany(args: FindManyModuleArgs, user?: User): Promise<Module[]> {
    const prismaArgs = {
      ...args,
      where: {
        ...args.where,
      },
    };

    return super.findMany(prismaArgs);
  }

  async findModuleByName(name: string, resourceId: string): Promise<Module[]> {
    const modules = await this.findMany({
      where: {
        resource: {
          id: resourceId,
        },
      },
    });
    const lowerName = name.toLowerCase();

    return modules.filter((module) => module.name.toLowerCase() === lowerName);
  }

  async create(
    args: CreateModuleArgs,
    user: User,
    trackEvent = true,
    forceEntitlementValidation = true
  ): Promise<Module> {
    if (!args.data.entityId && !this.customActionsEnabled) {
      return null;
    }
    if (forceEntitlementValidation) {
      await validateCustomActionsEntitlement(
        user.workspace?.id,
        this.billingService,
        this.logger
      );
    }

    this.validateModuleName(args.data.name);

    const otherModule = await this.findModuleByName(
      args.data.name,
      args.data.resource.connect.id
    );

    if (otherModule.length > 0) {
      throw new AmplicationError(
        `Module with name ${args.data.name} already exists in resource ${args.data.resource.connect.id}`
      );
    }

    if (trackEvent) {
      const subscription = await this.billingService.getSubscription(
        user.workspace?.id
      );

      await this.analytics.trackWithContext({
        properties: {
          name: args.data.name,
          planType: subscription.subscriptionPlan,
        },
        event: EnumEventType.CreateModule,
      });
    }

    return super.create(
      {
        ...args,
        data: {
          ...args.data,
          displayName: args.data.name,
          enabled: true,
        },
      },
      user
    );
  }

  async update(args: UpdateModuleArgs, user: User): Promise<Module> {
    await validateCustomActionsEntitlement(
      user.workspace?.id,
      this.billingService,
      this.logger
    );

    const existingModule = await super.findOne({
      where: {
        id: args.where.id,
      },
    });

    if (existingModule?.entityId) {
      if (
        existingModule.name !== args.data.name &&
        args.data.name !== undefined
      ) {
        throw new AmplicationError(
          "Cannot update the name of a default Module for entity."
        );
      }
    }

    if (args.data.name !== undefined) {
      this.validateModuleName(args.data.name);

      const otherModule = await this.findModuleByName(
        args.data.name,
        existingModule.resourceId
      );

      if (
        otherModule.length > 0 &&
        otherModule.filter((module) => module.id !== args.where.id).length > 0
      ) {
        throw new AmplicationError(
          `Module with name ${args.data.name} already exists in resource ${existingModule.resourceId}`
        );
      }
    }

    const subscription = await this.billingService.getSubscription(
      user.workspace?.id
    );

    await this.analytics.trackWithContext({
      properties: {
        name: args.data.name ? args.data.name : existingModule.name,
        planType: subscription.subscriptionPlan,
        operation:
          args.data.enabled !== undefined
            ? `toggle changed to: ${args.data.enabled}`
            : "meta data updated",
      },
      event: EnumEventType.InteractModule,
    });

    return super.update(
      {
        ...args,
        data: {
          ...args.data,
          displayName: args.data.name,
        },
      },
      user
    );
  }

  async delete(
    args: DeleteModuleArgs,
    @UserEntity() user: User
  ): Promise<Module> {
    await validateCustomActionsEntitlement(
      user.workspace?.id,
      this.billingService,
      this.logger
    );

    const module = await super.findOne(args);

    if (module?.entityId) {
      throw new AmplicationError(
        "Cannot delete the default module for entity. To delete it, you must delete the entity"
      );
    }
    await this.validateDtoReferencesBeforeDeleteModule(
      module.id,
      module.resourceId
    );
    await this.validateActionsDtosReferencesBeforeDeleteModule(
      module.id,
      module.resourceId
    );

    const subscription = await this.billingService.getSubscription(
      user.workspace?.id
    );

    await this.analytics.trackWithContext({
      properties: {
        name: module.name,
        planType: subscription.subscriptionPlan,
        operation: "delete",
      },
      event: EnumEventType.InteractModule,
    });

    return super.delete(args, user, true, true);
  }

  async createDefaultModuleForEntity(
    args: CreateModuleArgs,
    entity: Entity,
    user: User
  ): Promise<Module> {
    const module = await this.create(
      {
        ...args,
        data: {
          ...args.data,
          description: DEFAULT_MODULE_DESCRIPTION,
          entityId: entity.id,
        },
      },
      user,
      false,
      false
    );

    await this.moduleActionService.createDefaultActionsForEntityModule(
      entity,
      module,
      user
    );

    await this.moduleDtoService.createDefaultDtosForEntityModule(
      entity,
      module.id,
      user
    );

    return module;
  }

  async getDefaultModuleIdForEntity(
    resourceId: string,
    entityId: string
  ): Promise<string> {
    const [module] = await this.findManyBySettings(
      {
        where: {
          resource: {
            id: resourceId,
          },
        },
      },
      {
        path: ["entityId"],
        equals: entityId,
      }
    );

    if (!module) {
      throw new DefaultModuleForEntityNotFoundError(entityId);
    }

    return module.id;
  }

  async updateDefaultModuleForEntity(
    args: ModuleUpdateInput,
    entity: Entity,
    user: User
  ): Promise<Module> {
    const moduleId = await this.getDefaultModuleIdForEntity(
      entity.resourceId,
      entity.id
    );

    const module = await super.update(
      {
        where: {
          id: moduleId,
        },
        data: args,
      },
      user
    );

    await this.moduleActionService.updateDefaultActionsForEntityModule(
      entity,
      module,
      user
    );

    await this.moduleDtoService.updateDefaultDtosForEntityModule(
      entity,
      module,
      user
    );

    return module;
  }

  async deleteDefaultModuleForEntity(
    resourceId: string,
    entityId: string,
    user: User
  ): Promise<Module> {
    const moduleId = await this.getDefaultModuleIdForEntity(
      resourceId,
      entityId
    );

    await this.validateDtoReferencesBeforeDeleteModule(
      moduleId,
      resourceId,
      true
    );
    await this.validateActionsDtosReferencesBeforeDeleteModule(
      moduleId,
      resourceId,
      true
    );

    return super.delete({ where: { id: moduleId } }, user, true); //delete the module and all its children (actions/type...)
  }

  private async validateDtoReferencesBeforeDeleteModule(
    moduleId: string,
    resourceId: string,
    isEntity = false
  ) {
    const deletedType = isEntity ? "entity" : "module";
    const allResourceModuleDtos = await this.moduleDtoService.findMany({
      where: {
        resource: {
          id: resourceId,
        },
      },
    });

    const moduleModuleDtos = allResourceModuleDtos.filter(
      (moduleDto) => moduleDto.parentBlockId === moduleId
    );

    const allOtherResourceCustomModuleDtos = allResourceModuleDtos.filter(
      (moduleDto) =>
        moduleDto.parentBlockId !== moduleId &&
        moduleDto.dtoType === EnumModuleDtoType.Custom
    );

    allOtherResourceCustomModuleDtos.forEach((moduleDto) => {
      moduleDto.properties?.forEach((prop) => {
        if (prop) {
          prop.propertyTypes?.forEach((propType) => {
            const currentDto = moduleModuleDtos.find(
              (x) => x.id === propType.dtoId
            );
            if (currentDto)
              throw new AmplicationError(
                `Cannot delete ${deletedType} because DTO: ${currentDto.name} is in use in DTO: ${moduleDto.name}.`,
                { cause: "dtoInUse" }
              );
          });
        }
      });
    });
  }

  private async validateActionsDtosReferencesBeforeDeleteModule(
    moduleId: string,
    resourceId: string,
    isEntity = false
  ) {
    const deletedType = isEntity ? "entity" : "module";

    const moduleModuleDtos = await this.moduleDtoService.findMany({
      where: {
        parentBlock: {
          id: moduleId,
        },
        resource: {
          id: resourceId,
        },
      },
    });

    const allResourceModuleActions = await this.moduleActionService.findMany({
      where: {
        resource: {
          id: resourceId,
        },
      },
    });

    const allOtherResourceCustomModuleActions = allResourceModuleActions.filter(
      (moduleAction) =>
        moduleAction.parentBlockId !== moduleId &&
        moduleAction.actionType === EnumModuleActionType.Custom
    );

    allOtherResourceCustomModuleActions.forEach((moduleAction) => {
      if (
        moduleAction.inputType.type === EnumModuleDtoPropertyType.Dto ||
        moduleAction.inputType.type === EnumModuleDtoPropertyType.Enum
      ) {
        const currentDtoInput = moduleModuleDtos.find(
          (moduleDto) => moduleDto.id === moduleAction.inputType.dtoId
        );
        if (currentDtoInput) {
          throw new AmplicationError(
            `Cannot delete ${deletedType} because DTO: ${currentDtoInput.name} is in use in Action: ${moduleAction.name}.`,
            { cause: "ActionDtoInUse" }
          );
        }
      }
      if (
        moduleAction.outputType.type === EnumModuleDtoPropertyType.Dto ||
        moduleAction.outputType.type === EnumModuleDtoPropertyType.Enum
      ) {
        const currentDtoOutput = moduleModuleDtos.find(
          (moduleDto) => moduleDto.id === moduleAction.outputType.dtoId
        );
        if (currentDtoOutput) {
          throw new AmplicationError(
            `Cannot delete ${deletedType} because DTO: ${currentDtoOutput.name} is in use in Action: ${moduleAction.name}.`,
            { cause: "ActionDtoInUse" }
          );
        }
      }
    });
  }
}
