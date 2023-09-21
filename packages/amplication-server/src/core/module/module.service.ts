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
import { ModuleUpdateInput } from "./dto/ModuleUpdateInput";
import { PrismaService } from "../../prisma";

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

  constructor(
    protected readonly blockService: BlockService,
    private readonly prisma: PrismaService
  ) {
    super(blockService);
  }

  validateModuleName(moduleName: string): void {
    const regex = /^[a-zA-Z0-9._-]{1,249}$/;
    if (!regex.test(moduleName)) {
      throw new Error("Invalid module name");
    }
  }

  async create(args: CreateModuleArgs, user: User): Promise<Module> {
    this.validateModuleName(args.data.name);

    return super.create(
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

  async update(args: UpdateModuleArgs, user: User): Promise<Module> {
    this.validateModuleName(args.data.name);
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
    const module = await super.findOne(args);

    if (module?.entityId) {
      throw new Error(
        "Cannot delete the default module for entity. To delete it, you must delete the entity"
      );
    }
    return super.delete(args, user);
  }

  async createDefaultModuleForEntity(
    args: CreateModuleArgs,
    entityId: string,
    user: User
  ): Promise<Module> {
    return this.create(
      {
        ...args,
        data: {
          ...args.data,
          description: DEFAULT_MODULE_DESCRIPTION,
          entityId: entityId,
        },
      },
      user
    );
  }

  async getDefaultModuleIdForEntity(
    resourceId: string,
    entityId: string
  ): Promise<string> {
    const [module] = await this.prisma.block.findMany({
      where: {
        resourceId: resourceId,
        versions: {
          some: {
            settings: {
              path: ["entityId"],
              equals: entityId,
            },
          },
        },
      },
    });

    if (!module) {
      throw new Error(
        "Cannot find module for entity with entityId " + entityId
      );
    }

    return module.id;
  }

  async updateDefaultModuleForEntity(
    args: ModuleUpdateInput,
    resourceId: string,
    entityId: string,
    user: User
  ): Promise<Module> {
    const moduleId = await this.getDefaultModuleIdForEntity(
      resourceId,
      entityId
    );

    return this.update(
      {
        where: {
          id: moduleId,
        },
        data: args,
      },
      user
    );
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

    return super.delete({ where: { id: moduleId } }, user);
  }
}
