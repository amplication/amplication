import { Injectable } from "@nestjs/common";
import { UserEntity } from "../../decorators/user.decorator";
import { EnumBlockType } from "../../enums/EnumBlockType";
import { Entity, User } from "../../models";
import { BlockService } from "../block/block.service";
import { BlockTypeService } from "../block/blockType.service";
import { CreateModuleActionArgs } from "./dto/CreateModuleActionArgs";
import { DeleteModuleActionArgs } from "./dto/DeleteModuleActionArgs";
import { FindManyModuleActionArgs } from "./dto/FindManyModuleActionArgs";
import { ModuleAction } from "./dto/ModuleAction";
import { UpdateModuleActionArgs } from "./dto/UpdateModuleActionArgs";
import { ModuleActionUpdateInput } from "./dto/ModuleActionUpdateInput";
import { PrismaService } from "../../prisma";
import { pascalCase } from "pascal-case";
import { Module } from "../module/dto/Module";
import { prepareEntityPluralName } from "libs/util/dsg-utils/src";

const DEFAULT_MODULE_DESCRIPTION =
  "This module was automatically created as the default module for an entity";

type ModuleActionData = Pick<
  ModuleAction,
  "description" | "displayName" | "enabled" | "isDefault" | "name"
>;

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
      throw new Error("Invalid moduleAction name");
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
          enabled: true,
          isDefault: false,
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
    return super.update(args, user);
  }

  async delete(
    args: DeleteModuleActionArgs,
    @UserEntity() user: User
  ): Promise<ModuleAction> {
    const moduleAction = await super.findOne(args);

    if (moduleAction?.isDefault) {
      throw new Error(
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
    const defaultActions = await this.getDefaultActionsForEntity(entity);
    return await Promise.all(
      defaultActions.map((action) =>
        super.create(
          {
            data: {
              ...action,
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
      )
    );
  }

  async getDefaultModuleActionIdForEntity(
    resourceId: string,
    entityId: string
  ): Promise<string> {
    const [moduleAction] = await this.prisma.block.findMany({
      where: {
        resourceId: resourceId,
        deletedAt: null,
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

    // if (!moduleAction) {
    //   throw new DefaultModuleActionForEntityNotFoundError(entityId);
    // }

    return moduleAction.id;
  }

  async updateDefaultModuleActionForEntity(
    args: ModuleActionUpdateInput,
    resourceId: string,
    entityId: string,
    user: User
  ): Promise<ModuleAction> {
    const moduleActionId = await this.getDefaultModuleActionIdForEntity(
      resourceId,
      entityId
    );

    return this.update(
      {
        where: {
          id: moduleActionId,
        },
        data: args,
      },
      user
    );
  }

  async deleteDefaultModuleActionForEntity(
    resourceId: string,
    entityId: string,
    user: User
  ): Promise<ModuleAction> {
    const moduleActionId = await this.getDefaultModuleActionIdForEntity(
      resourceId,
      entityId
    );

    return super.delete({ where: { id: moduleActionId } }, user);
  }

  async getDefaultActionsForEntity(
    entity: Entity
  ): Promise<ModuleActionData[]> {
    const entityPluralName = pascalCase(prepareEntityPluralName(entity.name));
    const entityName = entity.name;

    const entityDisplayName = entity.displayName;
    const entityPluralDisplayName = entity.pluralDisplayName;

    //-----common-----
    //findMany
    //findOne
    //count
    //create
    //update
    //delete

    //-----to one child RESOLVER ONLY-----
    //resolve field child (based on field name not entity name)

    //-----to many children RESOLVER ONLY-----
    //resolve field children (based on field name not entity name)

    //-----to many child CONTROLLER ONLY-----
    //findMany (based on field name not entity name)
    //connect (based on field name not entity name)
    //update (based on field name not entity name)
    //disconnect (based on field name not entity name)

    //-----to many children SERVICE ONLY-----
    //find children (based on field name not entity name)

    //-----to one child SERVICE ONLY-----
    //get child (based on field name not entity name)

    return [
      {
        name: `count${entityPluralName}`,
        displayName: `Count ${entityPluralDisplayName}`,
        description: `Count ${entityPluralDisplayName}`,
        enabled: true,
        isDefault: true,
      },
      {
        name: `findMany${entityPluralName}`,
        displayName: `Find Many ${entityPluralDisplayName}`,
        description: `Find many ${entityPluralDisplayName}`,
        enabled: true,
        isDefault: true,
      },
      {
        name: `findOne${entityName}`,
        displayName: `Find One ${entityDisplayName}`,
        description: `Find one ${entityDisplayName}`,
        enabled: true,
        isDefault: true,
      },
      {
        name: `create${entityName}`,
        displayName: `Create ${entityDisplayName}`,
        description: `Create ${entityDisplayName}`,
        enabled: true,
        isDefault: true,
      },
      {
        name: `update${entityName}`,
        displayName: `Update ${entityDisplayName}`,
        description: `Update ${entityDisplayName}`,
        enabled: true,
        isDefault: true,
      },
      {
        name: `delete${entityName}`,
        displayName: `Delete ${entityDisplayName}`,
        description: `Delete ${entityDisplayName}`,
        enabled: true,
        isDefault: true,
      },
    ];
  }
}
