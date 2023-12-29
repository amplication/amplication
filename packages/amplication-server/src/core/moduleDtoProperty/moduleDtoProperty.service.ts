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
import { CreateModuleDtoPropertyArgs } from "./dto/CreateModuleDtoPropertyArgs";
import { DeleteModuleDtoPropertyArgs } from "./dto/DeleteModuleDtoPropertyArgs";
import { FindManyModuleDtoPropertyArgs } from "./dto/FindManyModuleDtoPropertyArgs";
import { ModuleDtoProperty } from "./dto/ModuleDtoProperty";
import { UpdateModuleDtoPropertyArgs } from "./dto/UpdateModuleDtoPropertyArgs";

@Injectable()
export class ModuleDtoPropertyService extends BlockTypeService<
  ModuleDtoProperty,
  FindManyModuleDtoPropertyArgs,
  CreateModuleDtoPropertyArgs,
  UpdateModuleDtoPropertyArgs,
  DeleteModuleDtoPropertyArgs
> {
  blockType = EnumBlockType.ModuleDtoProperty;

  constructor(
    protected readonly blockService: BlockService,
    private readonly prisma: PrismaService
  ) {
    super(blockService);
  }

  validateModuleDtoPropertyName(moduleDtoPropertyName: string): void {
    const regex = /^[a-zA-Z0-9._-]{1,249}$/;
    if (!regex.test(moduleDtoPropertyName)) {
      throw new AmplicationError("Invalid moduleDtoProperty name");
    }
  }

  async create(
    args: CreateModuleDtoPropertyArgs,
    user: User
  ): Promise<ModuleDtoProperty> {
    this.validateModuleDtoPropertyName(args.data.name);

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

  async update(
    args: UpdateModuleDtoPropertyArgs,
    user: User
  ): Promise<ModuleDtoProperty> {
    //todo: validate that only the enabled field can be updated for default actions
    this.validateModuleDtoPropertyName(args.data.name);

    const existingDto = await super.findOne({
      where: { id: args.where.id },
    });

    if (!existingDto) {
      throw new AmplicationError(`Module DTO not found, ID: ${args.where.id}`);
    }

    return super.update(args, user);
  }

  async delete(
    args: DeleteModuleDtoPropertyArgs,
    @UserEntity() user: User
  ): Promise<ModuleDtoProperty> {
    const moduleDtoProperty = await super.findOne(args);

    return super.delete(args, user);
  }
}
