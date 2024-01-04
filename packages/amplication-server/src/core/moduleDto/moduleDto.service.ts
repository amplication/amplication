import * as CodeGenTypes from "@amplication/code-gen-types";
import {
  getDefaultDtosForEntity,
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
import { CreateModuleDtoArgs } from "./dto/CreateModuleDtoArgs";
import { DeleteModuleDtoArgs } from "./dto/DeleteModuleDtoArgs";
import { FindManyModuleDtoArgs } from "./dto/FindManyModuleDtoArgs";
import { ModuleDto } from "./dto/ModuleDto";
import { UpdateModuleDtoArgs } from "./dto/UpdateModuleDtoArgs";
import { EnumModuleDtoType } from "./dto/EnumModuleDtoType";

@Injectable()
export class ModuleDtoService extends BlockTypeService<
  ModuleDto,
  FindManyModuleDtoArgs,
  CreateModuleDtoArgs,
  UpdateModuleDtoArgs,
  DeleteModuleDtoArgs
> {
  blockType = EnumBlockType.ModuleDto;

  constructor(
    protected readonly blockService: BlockService,
    private readonly prisma: PrismaService
  ) {
    super(blockService);
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
    this.validateModuleDtoName(args.data.name);

    return super.create(
      {
        ...args,
        data: {
          ...args.data,
          enabled: true,
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

    return super.update(args, user);
  }

  async delete(
    args: DeleteModuleDtoArgs,
    @UserEntity() user: User
  ): Promise<ModuleDto> {
    const moduleDto = await super.findOne(args);

    return super.delete(args, user);
  }

  async createDefaultDtosForEntityModule(
    entity: Entity,
    module: Module,
    user: User
  ): Promise<ModuleDto[]> {
    const defaultDtos = await getDefaultDtosForEntity(
      entity as unknown as CodeGenTypes.Entity
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
                name: defaultDtos[dto.dtoType].name,
                displayName: defaultDtos[dto.dtoType].name,
                description: defaultDtos[dto.dtoType].description,
                enabled: dto.enabled,
                //@todo: update properties
              },
            },
            user
          )
        );
      })
    );
  }
}
