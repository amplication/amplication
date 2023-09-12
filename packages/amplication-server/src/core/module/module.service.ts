import { Injectable } from "@nestjs/common";
import { UserEntity } from "../../decorators/user.decorator";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { User } from "../../models";
import { BlockService } from "../block/block.service";
import { BlockTypeService } from "../block/blockType.service";
import { CreateModuleArgs } from "./dto/CreateModuleArgs";
import { DeleteModuleArgs } from "./dto/DeleteModuleArgs";
import { FindManyModuleArgs } from "./dto/FindManyModuleArgs";
import { Module } from "./dto/Module";
import { UpdateModuleArgs } from "./dto/UpdateModuleArgs";

@Injectable()
export class ModuleService extends BlockTypeService<
  Module,
  FindManyModuleArgs,
  CreateModuleArgs,
  UpdateModuleArgs,
  DeleteModuleArgs
> {
  blockType = EnumBlockType.Module;

  constructor(protected readonly blockService: BlockService) {
    super(blockService);
  }

  async create(
    args: CreateModuleArgs,
    @UserEntity() user: User
  ): Promise<Module> {
    const regex = /^[a-zA-Z0-9._-]{1,249}$/;
    if (!regex.test(args.data.name)) {
      throw new Error("Invalid name");
    }
    return super.create(args, user);
  }

  async delete(
    args: DeleteModuleArgs,
    @UserEntity() user: User
  ): Promise<Module> {
    // prevent deleting an "entity module"
    return super.delete(args, user);
  }
}
