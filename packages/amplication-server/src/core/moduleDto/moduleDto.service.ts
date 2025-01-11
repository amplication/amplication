import * as CodeGenTypes from "@amplication/code-gen-types";
import {
  getDefaultDtosForEntity,
  getDefaultDtosForEnumField,
  getDefaultDtosForRelatedEntity,
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
import { CreateModuleDtoArgs } from "./dto/CreateModuleDtoArgs";
import { CreateModuleDtoPropertyArgs } from "./dto/CreateModuleDtoPropertyArgs";
import { DeleteModuleDtoArgs } from "./dto/DeleteModuleDtoArgs";
import { EnumModuleDtoType } from "./dto/EnumModuleDtoType";
import { FindManyModuleDtoArgs } from "./dto/FindManyModuleDtoArgs";
import { ModuleDto } from "./dto/ModuleDto";
import { ModuleDtoProperty } from "./dto/ModuleDtoProperty";
import { UpdateModuleDtoArgs } from "./dto/UpdateModuleDtoArgs";
import { EnumModuleDtoPropertyType } from "./dto/propertyTypes/EnumModuleDtoPropertyType";
import { UpdateModuleDtoPropertyArgs } from "./dto/UpdateModuleDtoPropertyArgs";
import { DeleteModuleDtoPropertyArgs } from "./dto/DeleteModuleDtoPropertyArgs";
import { ConfigService } from "@nestjs/config";
import { Env } from "../../env";
import { CreateModuleDtoEnumMemberArgs } from "./dto/CreateModuleDtoEnumMemberArgs";
import { ModuleDtoEnumMember } from "./dto/ModuleDtoEnumMember";
import { UpdateModuleDtoEnumMemberArgs } from "./dto/UpdateModuleDtoEnumMemberArgs";
import { DeleteModuleDtoEnumMemberArgs } from "./dto/DeleteModuleDtoEnumMemberArgs";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { BillingService } from "../billing/billing.service";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import { EnumEventType } from "../../services/segmentAnalytics/segmentAnalyticsEventType.types";
import { QueryMode } from "../../enums/QueryMode";
import { validateCustomActionsEntitlement } from "../block/block.util";
import { JsonArray } from "type-fest";
import { PropertyTypeDef } from "./dto/propertyTypes/PropertyTypeDef";

const DEFAULT_DTO_PROPERTY: Omit<ModuleDtoProperty, "name"> = {
  isArray: false,
  isOptional: false,
  propertyTypes: [
    {
      type: EnumModuleDtoPropertyType.String,
      isArray: false,
    },
  ],
};

const UNSUPPORTED_TYPES = [
  EnumModuleDtoPropertyType.Null,
  EnumModuleDtoPropertyType.Undefined,
];

@Injectable()
export class ModuleDtoService extends BlockTypeService<
  ModuleDto,
  FindManyModuleDtoArgs,
  CreateModuleDtoArgs,
  UpdateModuleDtoArgs,
  DeleteModuleDtoArgs
> {
  blockType = EnumBlockType.ModuleDto;

  customActionsEnabled: boolean;

  constructor(
    protected readonly blockService: BlockService,
    protected readonly billingService: BillingService,
    protected readonly logger: AmplicationLogger,
    protected readonly analytics: SegmentAnalyticsService,
    private readonly prisma: PrismaService,
    private configService: ConfigService
  ) {
    super(blockService, logger);

    this.customActionsEnabled = Boolean(
      this.configService.get<string>(Env.FEATURE_CUSTOM_ACTIONS_ENABLED) ===
        "true"
    );
  }

  async availableDtosForResource(
    args: FindManyModuleDtoArgs
  ): Promise<ModuleDto[]> {
    //todo: extend query to return shared dtos from other resources in the project

    return this.findMany(args);
  }

  async findMany(
    args: FindManyModuleDtoArgs,
    user?: User
  ): Promise<ModuleDto[]> {
    const { includeCustomDtos, includeDefaultDtos, ...rest } = args.where || {};

    const prismaArgs = {
      ...args,
      where: {
        ...rest,
      },
    };

    //when undefined the default value is true
    const includeCustomDtosBoolean = includeCustomDtos !== false;
    const includeDefaultDtosBoolean = includeDefaultDtos !== false;

    if (includeCustomDtosBoolean && includeDefaultDtosBoolean) {
      return super.findMany(prismaArgs);
    } else if (includeCustomDtosBoolean) {
      return super.findManyBySettings(prismaArgs, [
        {
          path: ["dtoType"],
          equals: EnumModuleDtoType.Custom,
        },
        {
          path: ["dtoType"],
          equals: EnumModuleDtoType.CustomEnum,
        },
      ]);
    } else if (includeDefaultDtosBoolean) {
      return super.findManyBySettings(
        prismaArgs,
        [
          {
            path: ["dtoType"],
            not: EnumModuleDtoType.Custom,
          },
          {
            path: ["dtoType"],
            not: EnumModuleDtoType.CustomEnum,
          },
        ],
        "AND"
      );
    } else {
      return [];
    }
  }

  async validateModuleDtoName(
    moduleDtoName: string,
    resourceId?: string,
    blockId?: string
  ): Promise<void> {
    const regex = /^[a-zA-Z0-9._-]{1,249}$/;
    if (!regex.test(moduleDtoName)) {
      throw new AmplicationError("Invalid moduleDto name");
    }

    if (!resourceId) return;

    let duplicateDtoName: ModuleDto[] = [];

    if (!blockId) {
      duplicateDtoName = await super.findMany({
        where: {
          displayName: {
            equals: moduleDtoName,
            mode: QueryMode.Insensitive,
          },
          resource: {
            id: resourceId,
          },
        },
      });
    } else {
      duplicateDtoName = await super.findMany({
        where: {
          id: {
            not: blockId,
          },
          displayName: {
            equals: moduleDtoName,
            mode: QueryMode.Insensitive,
          },
          resource: {
            id: resourceId,
          },
        },
      });
    }

    if (duplicateDtoName.length > 0) {
      throw new AmplicationError("Invalid DTO name, name already exists");
    }
  }

  async create(args: CreateModuleDtoArgs, user: User): Promise<ModuleDto> {
    if (!this.customActionsEnabled) {
      return null;
    }
    await validateCustomActionsEntitlement(
      user.workspace?.id,
      this.billingService,
      this.logger
    );

    await this.validateModuleDtoName(
      args.data.name,
      args.data.resource.connect.id
    );

    const subscription = await this.billingService.getSubscription(
      user.workspace?.id
    );

    await this.analytics.trackWithContext({
      properties: {
        name: args.data.name,
        planType: subscription.subscriptionPlan,
      },
      event: EnumEventType.CreateUserDTO,
    });

    //make sure the properties are initialized correctly
    const properties: ModuleDtoProperty[] = (
      args.properties as unknown as JsonArray
    )?.map((property) => {
      return {
        ...DEFAULT_DTO_PROPERTY,
        ...property,
        propertyTypes: property.propertyTypes.map((propertyType) => {
          return {
            ...DEFAULT_DTO_PROPERTY.propertyTypes[0],
            ...propertyType,
          };
        }),
      };
    });

    if (properties) {
      for (const property of properties) {
        await this.validateTypes(
          args.data.resource.connect.id,
          property.propertyTypes,
          UNSUPPORTED_TYPES
        );
      }
    }

    return super.create(
      {
        ...args,
        data: {
          ...args.data,
          properties: (properties as unknown as JsonArray) ?? [],
          enabled: true,
          dtoType: EnumModuleDtoType.Custom,
        },
      },
      user
    );
  }

  async update(args: UpdateModuleDtoArgs, user: User): Promise<ModuleDto> {
    //todo: validate that only the enabled field can be updated for default actions
    await validateCustomActionsEntitlement(
      user.workspace?.id,
      this.billingService,
      this.logger
    );

    const existingDto = await super.findOne({
      where: { id: args.where.id },
    });

    if (!existingDto) {
      throw new AmplicationError(`Module DTO not found, ID: ${args.where.id}`);
    }

    await this.validateModuleDtoName(
      args.data.name,
      existingDto.resourceId,
      existingDto.id
    );

    if (existingDto.dtoType !== EnumModuleDtoType.Custom) {
      if (existingDto.name !== args.data.name) {
        throw new AmplicationError("Cannot update the name of a default DTO");
      }
    }

    args.data.displayName = args.data.name;

    const subscription = await this.billingService.getSubscription(
      user.workspace?.id
    );

    await this.analytics.trackWithContext({
      properties: {
        dtoParameters: args.data,
        operation: "edit",
        planType: subscription.subscriptionPlan,
      },
      event: EnumEventType.InteractUserDTO,
    });

    return super.update(args, user);
  }

  async delete(
    args: DeleteModuleDtoArgs,
    @UserEntity() user: User
  ): Promise<ModuleDto> {
    await validateCustomActionsEntitlement(
      user.workspace?.id,
      this.billingService,
      this.logger
    );

    const moduleDto = await super.findOne(args);

    if (
      moduleDto?.dtoType !== EnumModuleDtoType.Custom &&
      moduleDto?.dtoType !== EnumModuleDtoType.CustomEnum
    ) {
      throw new AmplicationError(
        "Cannot delete a default DTO. To delete it, you must delete the entity"
      );
    }
    const subscription = await this.billingService.getSubscription(
      user.workspace?.id
    );

    await this.analytics.trackWithContext({
      properties: {
        name: moduleDto.name,
        operation: "delete",
        planType: subscription.subscriptionPlan,
      },
      event: EnumEventType.InteractUserDTO,
    });

    return super.delete(args, user);
  }

  async createDefaultDtosForEntityModule(
    entity: Entity,
    moduleId: Module["id"],
    user: User
  ): Promise<ModuleDto[]> {
    if (!this.customActionsEnabled) {
      return [];
    }

    const defaultDtos = await getDefaultDtosForEntity(
      entity as unknown as CodeGenTypes.Entity
    );
    const existingModuleDtosForEntity = await this.findMany({
      where: {
        parentBlock: {
          id: moduleId,
        },
      },
    });

    const existingModuleDtosForEntityMap = existingModuleDtosForEntity.reduce(
      (map, dto) => {
        map[dto.dtoType] = dto;
        return map;
      },
      {} as Record<string, ModuleDto>
    );

    const promisesResults = await Promise.allSettled(
      Object.entries(defaultDtos).map(async ([dtoType, dtoData]) => {
        return existingModuleDtosForEntityMap[dtoType]
          ? null
          : super.create(
              {
                data: {
                  ...dtoData,
                  displayName: dtoData.name,
                  properties: [], //default DTOs do not have properties
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
              //@todo: create properties
            );
      })
    );

    return promisesResults.reduce((acc, result) => {
      // if the promise was rejected or the moduleDto Block was already created, we return the accumulator
      if (result.status === "rejected") {
        const error = result.reason as Error;
        this.logger.error(error.message, error, ModuleDtoService.name);
        return acc;
      }

      return result.value ? [...acc, result.value] : acc;
    }, [] as ModuleDto[]);
  }

  //call this function when the entity names changes, and we need to update the default dtos
  async updateDefaultDtosForEntityModule(
    entity: Entity,
    module: Module,
    user: User
  ): Promise<ModuleDto[]> {
    if (!this.customActionsEnabled) {
      return [];
    }

    //get the updated default dtos (with updated names)
    const defaultDtos = await getDefaultDtosForEntity(
      entity as unknown as CodeGenTypes.Entity
    );

    //get the current default dtos
    const existingDefaultDtos = await this.findManyBySettings(
      {
        where: {
          parentBlock: {
            id: module.id,
          },
        },
      },
      {
        path: ["dtoType"],
        not: EnumModuleDtoType.Custom,
      }
    );

    //@todo: add missing dtos, remove unused dtos, update existing dtos

    return await Promise.all(
      existingDefaultDtos.map((dto) => {
        return (
          defaultDtos[dto.dtoType] &&
          super.update(
            {
              where: {
                id: dto.id,
              },
              data: {
                ...defaultDtos[dto.dtoType],
                properties: [], //default DTOs do not have properties
                displayName: defaultDtos[dto.dtoType].name,
                enabled: dto.enabled,
              },
            },
            user
          )
        );
      })
    );
  }

  async createDefaultDtosForRelatedEntity(
    entity: Entity,
    relatedField: EntityField,
    relatedEntity: Entity,
    moduleId: ModuleDto["id"],
    user: User
  ): Promise<ModuleDto[]> {
    if (!this.customActionsEnabled) {
      return [];
    }

    // Cast the field properties as Lookup properties
    const properties =
      relatedField.properties as unknown as CodeGenTypes.types.Lookup;

    //We only need to create default DTOs for many-to-one relations
    if (!properties.allowMultipleSelection) {
      return [];
    }

    //Check if a default dto already exists for this relation
    const existingDefaultDto = await this.findManyBySettings(
      {
        where: {
          parentBlock: {
            id: moduleId,
          },
        },
      },
      {
        path: ["relatedEntityId"],
        equals: relatedEntity.id,
      }
    );

    const defaultDtos = await getDefaultDtosForRelatedEntity(
      entity as unknown as CodeGenTypes.Entity,
      relatedEntity as unknown as CodeGenTypes.Entity
    );

    const existingModuleDtosForRelationMap = existingDefaultDto.reduce(
      (map, dto) => {
        map[dto.dtoType] = dto;
        return map;
      },
      {} as Record<string, ModuleDto>
    );

    const promisesResults = await Promise.allSettled(
      Object.entries(defaultDtos).map(([dtoType, dtoData]) => {
        return existingModuleDtosForRelationMap[dtoType]
          ? null
          : super.create(
              {
                data: {
                  ...dtoData,
                  displayName: dtoData.name,
                  relatedEntityId: relatedEntity.id,
                  properties: [], //default DTOs do not have properties
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
            );
      })
    );

    return promisesResults.reduce((acc, result) => {
      // if the promise was rejected or the moduleDto Block was already created, we return the accumulator
      if (result.status === "rejected") {
        const error = result.reason as Error;
        this.logger.error(error.message, error, ModuleDtoService.name);
        return acc;
      }

      return result.value ? [...acc, result.value] : acc;
    }, [] as ModuleDto[]);
  }

  async updateDefaultDtosForRelatedEntity(
    entity: Entity,
    relatedField: EntityField,
    relatedEntity: Entity,
    moduleId: string,
    user: User
  ): Promise<ModuleDto[]> {
    if (!this.customActionsEnabled) {
      return [];
    }

    const properties =
      relatedField.properties as unknown as CodeGenTypes.types.Lookup;

    //We only need to update default DTOs for many-to-one relations
    if (!properties.allowMultipleSelection) {
      return null;
    }

    const defaultDtos = await getDefaultDtosForRelatedEntity(
      entity as unknown as CodeGenTypes.Entity,
      relatedEntity as unknown as CodeGenTypes.Entity
    );

    //get the current default DTOs
    const existingDefaultDtos = await this.findManyBySettings(
      {
        where: {
          parentBlock: {
            id: moduleId,
          },
        },
      },
      {
        path: ["relatedEntityId"],
        equals: relatedEntity.id,
      }
    );
    //if the default dtos does not exist, it may happen if the relation type was changed to one-to-many
    if (existingDefaultDtos.length === 0) {
      return await this.createDefaultDtosForRelatedEntity(
        entity,
        relatedField,
        relatedEntity,
        moduleId,
        user
      );
    }

    return await Promise.all(
      existingDefaultDtos.map((dto) => {
        return (
          defaultDtos[dto.dtoType] &&
          super.update(
            {
              where: {
                id: dto.id,
              },
              data: {
                ...defaultDtos[dto.dtoType],
                properties: [], //default DTOs do not have properties
                displayName: defaultDtos[dto.dtoType].name,
                enabled: dto.enabled,
              },
            },
            user
          )
        );
      })
    );
  }

  async deleteDefaultDtosForRelatedEntity(
    relatedField: EntityField,
    relatedEntity: Entity,
    moduleId: string,
    user: User
  ): Promise<Module[]> {
    // Cast the field properties as Lookup properties
    const properties =
      relatedField.properties as unknown as CodeGenTypes.types.Lookup;

    //We only need to delete default DTOs if the deleted field was many-to-one relations
    if (!properties.allowMultipleSelection) {
      return null;
    }

    //get the current default dtos
    const existingDefaultDtos = await this.findManyBySettings(
      {
        where: {
          parentBlock: {
            id: moduleId,
          },
        },
      },
      {
        path: ["relatedEntityId"],
        equals: relatedEntity.id,
      }
    );

    return await Promise.all(
      existingDefaultDtos.map((dto) =>
        super.delete(
          {
            where: {
              id: dto.id,
            },
          },
          user,
          true
        )
      )
    );
  }

  async createDtoProperty(
    args: CreateModuleDtoPropertyArgs,
    user: User
  ): Promise<ModuleDtoProperty> {
    const dto = await super.findOne({
      where: { id: args.data.moduleDto.connect.id },
    });
    if (!dto) {
      throw new AmplicationError(
        `Module DTO not found, ID: ${args.data.moduleDto.connect.id}`
      );
    }

    if (dto.dtoType !== EnumModuleDtoType.Custom) {
      throw new AmplicationError("Cannot add properties on default DTOs");
    }

    const existingProperty = dto.properties?.find(
      (property) => property.name === args.data.name
    );
    if (existingProperty) {
      throw new AmplicationError(
        `Property already exists, name: ${args.data.name}, DTO ID: ${args.data.moduleDto.connect.id}`
      );
    }

    const newProperty = {
      ...DEFAULT_DTO_PROPERTY,
      name: args.data.name,
    };

    await super.update(
      {
        where: { id: dto.id },
        data: {
          name: dto.name,
          enabled: dto.enabled,
          properties: [...(dto.properties || []), newProperty],
        },
      },
      user
    );

    return newProperty;
  }

  async updateDtoProperty(
    args: UpdateModuleDtoPropertyArgs,
    user: User
  ): Promise<ModuleDtoProperty> {
    const dto = await super.findOne({
      where: { id: args.where.moduleDto.id },
    });
    if (!dto) {
      throw new AmplicationError(
        `Module DTO not found, ID: ${args.where.moduleDto.id}`
      );
    }

    if (dto.dtoType !== EnumModuleDtoType.Custom) {
      throw new AmplicationError("Cannot update properties on default DTOs");
    }

    const existingPropertyIndex = dto.properties?.findIndex(
      (property) => property.name === args.where.propertyName
    );

    if (existingPropertyIndex === -1) {
      throw new AmplicationError(
        `Property not found, name: ${args.where.propertyName}, DTO ID: ${args.where.moduleDto.id}`
      );
    }

    if (args.data.name !== args.where.propertyName) {
      const existingPropertyWithNewName = dto.properties.find(
        (property) => property.name === args.data.name
      );
      if (existingPropertyWithNewName) {
        throw new AmplicationError(
          `Property already exists, name: ${args.data.name}, DTO ID: ${args.where.moduleDto.id}`
        );
      }
    }

    await this.validateTypes(
      dto.resourceId,
      args.data.propertyTypes,
      UNSUPPORTED_TYPES
    );

    const existingProperty = dto.properties[existingPropertyIndex];

    const newProperty = {
      ...existingProperty,
      ...args.data,
    };

    dto.properties[existingPropertyIndex] = newProperty;

    await super.update(
      {
        where: { id: dto.id },
        data: {
          name: dto.name,
          enabled: dto.enabled,
          properties: dto.properties,
        },
      },
      user
    );

    return newProperty;
  }

  async deleteDtoProperty(
    args: DeleteModuleDtoPropertyArgs,
    user: User
  ): Promise<ModuleDtoProperty> {
    const dto = await super.findOne({
      where: { id: args.where.moduleDto.id },
    });
    if (!dto) {
      throw new AmplicationError(
        `Module DTO not found, ID: ${args.where.moduleDto.id}`
      );
    }
    if (dto.dtoType !== EnumModuleDtoType.Custom) {
      throw new AmplicationError("Cannot delete properties from default DTOs");
    }

    const existingPropertyIndex = dto.properties?.findIndex(
      (property) => property.name === args.where.propertyName
    );

    if (existingPropertyIndex === -1) {
      throw new AmplicationError(
        `Property not found, name: ${args.where.propertyName}, DTO ID: ${args.where.moduleDto.id}`
      );
    }

    const [deleted] = dto.properties.splice(existingPropertyIndex, 1);

    await super.update(
      {
        where: { id: dto.id },
        data: {
          name: dto.name,
          enabled: dto.enabled,
          properties: dto.properties,
        },
      },
      user
    );

    return deleted;
  }

  async createDefaultDtoForEnumField(
    entity: Entity,
    enumField: EntityField,
    moduleId: string,
    user: User
  ): Promise<ModuleDto> {
    if (!this.customActionsEnabled) {
      return null;
    }

    //Check if a default dto already exists for this relation
    const existingDefaultDto = await this.findManyBySettings(
      {
        where: {
          parentBlock: {
            id: moduleId,
          },
        },
      },
      {
        path: ["relatedFieldId"], //we currently only using DTO for the enum, in case we may have multiple DTOs for the same entity, we need to filter by type also
        equals: enumField.permanentId,
      }
    );

    if (existingDefaultDto.length > 0) {
      return existingDefaultDto[0];
    }

    const defaultDto = await getDefaultDtosForEnumField(
      entity as unknown as CodeGenTypes.Entity,
      enumField as unknown as CodeGenTypes.EntityField
    );

    return await super.create(
      {
        data: {
          ...defaultDto,
          displayName: defaultDto.name,
          relatedFieldId: enumField.permanentId,
          properties: [], //default DTOs do not have properties
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
    );
  }

  async updateDefaultDtoForEnumField(
    entity: Entity,
    enumField: EntityField,
    moduleId: string,
    user: User
  ): Promise<ModuleDto> {
    if (!this.customActionsEnabled) {
      return null;
    }
    const defaultDto = await getDefaultDtosForEnumField(
      entity as unknown as CodeGenTypes.Entity,
      enumField as unknown as CodeGenTypes.EntityField
    );

    //get the current default DTO for this field
    const [existingDefaultDto] = await this.findManyBySettings(
      {
        where: {
          parentBlock: {
            id: moduleId,
          },
        },
      },
      {
        path: ["relatedFieldId"], //we currently only using DTO for the enum, in case we may have multiple DTOs for the same entity, we need to filter by type also
        equals: enumField.permanentId,
      }
    );

    //if the default dtos does not exist, it may happen if the relation type was changed to one-to-many
    if (!existingDefaultDto) {
      return await this.createDefaultDtoForEnumField(
        entity,
        enumField,
        moduleId,
        user
      );
    }

    await super.update(
      {
        where: {
          id: existingDefaultDto.id,
        },
        data: {
          ...defaultDto,
          properties: [], //default DTOs do not have properties
          members: [], //default DTOs do not have members
          displayName: defaultDto.name,
          enabled: defaultDto.enabled,
        },
      },
      user
    );
  }

  async deleteDefaultDtoForEnumField(
    enumField: EntityField,
    moduleId: string,
    user: User
  ): Promise<Module[]> {
    //get the current default dtos
    const existingDefaultDtos = await this.findManyBySettings(
      {
        where: {
          parentBlock: {
            id: moduleId,
          },
        },
      },
      {
        path: ["relatedFieldId"], //we currently only using DTO for the enum, in case we may have multiple DTOs for the same entity, we need to filter by type also
        equals: enumField.permanentId,
      }
    );
    return await Promise.all(
      existingDefaultDtos.map((dto) =>
        super.delete(
          {
            where: {
              id: dto.id,
            },
          },
          user,
          true
        )
      )
    );
  }

  async createEnum(args: CreateModuleDtoArgs, user: User): Promise<ModuleDto> {
    if (!this.customActionsEnabled) {
      return null;
    }
    await validateCustomActionsEntitlement(
      user.workspace?.id,
      this.billingService,
      this.logger
    );

    await this.validateModuleDtoName(
      args.data.name,
      args.data.resource.connect.id
    );

    const subscription = await this.billingService.getSubscription(
      user.workspace?.id
    );

    await this.analytics.trackWithContext({
      properties: {
        name: args.data.name,
        planType: subscription.subscriptionPlan,
      },
      event: EnumEventType.CreateUserDTO,
    });

    return super.create(
      {
        ...args,
        data: {
          ...args.data,
          members: (args.members as unknown as JsonArray) ?? [],
          enabled: true,
          dtoType: EnumModuleDtoType.CustomEnum,
        },
      },
      user
    );
  }

  validateEnumMemberName(name: string): void {
    const regex = /^[a-zA-Z0-9._-]{1,249}$/;
    if (!regex.test(name)) {
      throw new AmplicationError("Invalid Enum member name");
    }
  }

  async createDtoEnumMember(
    args: CreateModuleDtoEnumMemberArgs,
    user: User
  ): Promise<ModuleDtoEnumMember> {
    this.validateEnumMemberName(args.data.name);

    const dto = await super.findOne({
      where: { id: args.data.moduleDto.connect.id },
    });
    if (!dto) {
      throw new AmplicationError(
        `Module DTO not found, ID: ${args.data.moduleDto.connect.id}`
      );
    }

    if (dto.dtoType !== EnumModuleDtoType.CustomEnum) {
      throw new AmplicationError(
        "Enum members can only be added to custom Enum DTOs"
      );
    }

    const existingMember = dto.members?.find(
      (member) => member.name === args.data.name
    );
    if (existingMember) {
      throw new AmplicationError(
        `Member already exists, name: ${args.data.name}, DTO ID: ${args.data.moduleDto.connect.id}`
      );
    }

    const newMember = {
      name: args.data.name,
      value: args.data.name,
    };

    await super.update(
      {
        where: { id: dto.id },
        data: {
          name: dto.name,
          enabled: dto.enabled,
          members: [...(dto.members || []), newMember],
        },
      },
      user
    );

    return newMember;
  }

  async updateDtoEnumMember(
    args: UpdateModuleDtoEnumMemberArgs,
    user: User
  ): Promise<ModuleDtoEnumMember> {
    this.validateEnumMemberName(args.data.name);

    const dto = await super.findOne({
      where: { id: args.where.moduleDto.id },
    });
    if (!dto) {
      throw new AmplicationError(
        `Module DTO not found, ID: ${args.where.moduleDto.id}`
      );
    }

    if (dto.dtoType !== EnumModuleDtoType.CustomEnum) {
      throw new AmplicationError(
        "Enum members can only be added to custom Enum DTOs"
      );
    }

    const existingMemberIndex = dto.members?.findIndex(
      (member) => member.name === args.where.enumMemberName
    );

    if (existingMemberIndex === -1) {
      throw new AmplicationError(
        `Enum member not found, name: ${args.where.enumMemberName}, DTO ID: ${args.where.moduleDto.id}`
      );
    }

    if (args.data.name !== args.where.enumMemberName) {
      const existingMemberWithNewName = dto.members.find(
        (member) => member.name === args.data.name
      );
      if (existingMemberWithNewName) {
        throw new AmplicationError(
          `Enum member already exists, name: ${args.data.name}, DTO ID: ${args.where.moduleDto.id}`
        );
      }
    }

    const existingMember = dto.members[existingMemberIndex];

    const newMember = {
      ...existingMember,
      ...args.data,
    };

    dto.members[existingMemberIndex] = newMember;

    await super.update(
      {
        where: { id: dto.id },
        data: {
          name: dto.name,
          enabled: dto.enabled,
          members: dto.members,
        },
      },
      user
    );

    return newMember;
  }

  async deleteDtoEnumMember(
    args: DeleteModuleDtoEnumMemberArgs,
    user: User
  ): Promise<ModuleDtoEnumMember> {
    const dto = await super.findOne({
      where: { id: args.where.moduleDto.id },
    });
    if (!dto) {
      throw new AmplicationError(
        `Module DTO not found, ID: ${args.where.moduleDto.id}`
      );
    }

    const existingEnumMemberIndex = dto.members?.findIndex(
      (enumMember) => enumMember.name === args.where.enumMemberName
    );

    if (existingEnumMemberIndex === -1) {
      throw new AmplicationError(
        `Enum Member not found, name: ${args.where.enumMemberName}, DTO ID: ${args.where.moduleDto.id}`
      );
    }

    const [deleted] = dto.members.splice(existingEnumMemberIndex, 1);

    await super.update(
      {
        where: { id: dto.id },
        data: {
          name: dto.name,
          enabled: dto.enabled,
          members: dto.members,
        },
      },
      user
    );

    return deleted;
  }

  async validateTypes(
    resourceId: string,
    types: PropertyTypeDef[],
    unsupportedTypes?: EnumModuleDtoPropertyType[]
  ): Promise<void> {
    for (const type of types) {
      if (!type) {
        throw new AmplicationError("Type is required");
      }

      if (!type.type) {
        throw new AmplicationError("Type is required");
      }

      if (unsupportedTypes?.includes(type.type as EnumModuleDtoPropertyType)) {
        throw new AmplicationError(
          `The type ${type.type} is not supported yet`
        );
      }

      if (
        type.type === EnumModuleDtoPropertyType.Dto ||
        type.type === EnumModuleDtoPropertyType.Enum
      ) {
        if (!type.dtoId) {
          throw new AmplicationError(
            `dtoId is required when type is ${type.type}`
          );
        }

        const existingDto = await this.availableDtosForResource({
          where: {
            resource: {
              id: resourceId,
            },
            id: {
              equals: type.dtoId,
            },
          },
        });

        if (!existingDto || existingDto.length === 0) {
          throw new AmplicationError(`Dto with id ${type.dtoId} not found`);
        }
      }
    }
  }
}
