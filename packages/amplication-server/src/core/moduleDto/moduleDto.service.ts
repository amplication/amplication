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
    private readonly prisma: PrismaService,
    private configService: ConfigService
  ) {
    super(blockService);

    this.customActionsEnabled = Boolean(
      this.configService.get<string>(Env.FEATURE_CUSTOM_ACTIONS_ENABLED) ===
        "true"
    );
  }

  async availableDtosForResource(
    args: FindManyModuleDtoArgs
  ): Promise<ModuleDto[]> {
    //todo: extend query to return shared dtos from other resources in the project

    return super.findMany(args);
  }

  validateModuleDtoName(moduleDtoName: string): void {
    const regex = /^[a-zA-Z0-9._-]{1,249}$/;
    if (!regex.test(moduleDtoName)) {
      throw new AmplicationError("Invalid moduleDto name");
    }
  }

  async create(args: CreateModuleDtoArgs, user: User): Promise<ModuleDto> {
    if (!this.customActionsEnabled) {
      return null;
    }

    this.validateModuleDtoName(args.data.name);

    return super.create(
      {
        ...args,
        data: {
          ...args.data,
          properties: [],
          enabled: true,
          dtoType: EnumModuleDtoType.Custom,
        },
      },
      user
    );
  }

  async update(args: UpdateModuleDtoArgs, user: User): Promise<ModuleDto> {
    //todo: validate that only the enabled field can be updated for default actions
    this.validateModuleDtoName(args.data.name);

    const existingDto = await super.findOne({
      where: { id: args.where.id },
    });

    if (!existingDto) {
      throw new AmplicationError(`Module DTO not found, ID: ${args.where.id}`);
    }

    if (existingDto.dtoType !== EnumModuleDtoType.Custom) {
      if (existingDto.name !== args.data.name) {
        throw new AmplicationError("Cannot update the name of a default DTO");
      }
    }

    args.data.displayName = args.data.name;

    return super.update(args, user);
  }

  async delete(
    args: DeleteModuleDtoArgs,
    @UserEntity() user: User
  ): Promise<ModuleDto> {
    const moduleDto = await super.findOne(args);

    if (moduleDto?.dtoType !== EnumModuleDtoType.Custom) {
      throw new AmplicationError(
        "Cannot delete a default DTO. To delete it, you must delete the entity"
      );
    }

    return super.delete(args, user);
  }

  async createDefaultDtosForEntityModule(
    entity: Entity,
    module: Module,
    user: User
  ): Promise<ModuleDto[]> {
    if (!this.customActionsEnabled) {
      return [];
    }

    const defaultDtos = await getDefaultDtosForEntity(
      entity as unknown as CodeGenTypes.Entity
    );
    return await Promise.all(
      Object.keys(defaultDtos).map((dto) => {
        const dtoData = defaultDtos[dto];

        return (
          defaultDtos[dto] &&
          super.create(
            {
              data: {
                ...dtoData,
                displayName: defaultDtos[dto].name,
                properties: [], //default DTOs do not have properties
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
            //@todo: create properties
          )
        );
      })
    );
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
    moduleId: string,
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
        path: ["relatedEntityId"],
        equals: relatedEntity.id,
      }
    );

    if (existingDefaultDto.length > 0) {
      return existingDefaultDto;
    }

    const defaultDtos = await getDefaultDtosForRelatedEntity(
      entity as unknown as CodeGenTypes.Entity,
      relatedEntity as unknown as CodeGenTypes.Entity
    );
    return await Promise.all(
      Object.keys(defaultDtos).map((dto) => {
        return (
          defaultDtos[dto] &&
          super.create(
            {
              data: {
                ...defaultDtos[dto],
                displayName: defaultDtos[dto].name,
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
          )
        );
      })
    );
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

    const existingProperty = dto.properties.find(
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
          properties: [...dto.properties, newProperty],
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

    const existingPropertyIndex = dto.properties.findIndex(
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

    const existingPropertyIndex = dto.properties.findIndex(
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

    this.validateModuleDtoName(args.data.name);

    return super.create(
      {
        ...args,
        data: {
          ...args.data,
          properties: [],
          enabled: true,
          dtoType: EnumModuleDtoType.CustomEnum,
        },
      },
      user
    );
  }
}
