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
import { CreateModuleDtoArgs } from "./dto/CreateModuleDtoArgs";
import { DeleteModuleDtoArgs } from "./dto/DeleteModuleDtoArgs";
import { FindManyModuleDtoArgs } from "./dto/FindManyModuleDtoArgs";
import { ModuleDto } from "./dto/ModuleDto";
import { UpdateModuleDtoArgs } from "./dto/UpdateModuleDtoArgs";

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
}
