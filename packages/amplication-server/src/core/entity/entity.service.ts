import {
  Injectable,
  NotFoundException,
  ConflictException
} from '@nestjs/common';
import { DataConflictError } from 'src/errors/DataConflictError';
import {
  SortOrder,
  EntityFieldDeleteArgs,
  EntityPermissionCreateManyWithoutEntityVersionInput,
  EntityVersionInclude,
  FindManyEntityPermissionArgs,
  EntityVersionWhereInput,
  FindManyEntityArgs,
  QueryMode
} from '@prisma/client';
import { camelCase } from 'camel-case';
import head from 'lodash.head';
import last from 'lodash.last';
import omit from 'lodash.omit';
import difference from '@extra-set/difference';
import { isEmpty, pick } from 'lodash';
import {
  Entity,
  EntityField,
  EntityVersion,
  Commit,
  User,
  EntityPermission,
  EntityPermissionField
} from 'src/models';
import { JsonObject, JsonValue } from 'type-fest';
import { PrismaService } from 'nestjs-prisma';
import { getSchemaForDataType } from 'amplication-data';
import { JsonSchemaValidationService } from 'src/services/jsonSchemaValidation.service';
import { EnumDataType } from 'src/enums/EnumDataType';
import { SchemaValidationResult } from 'src/dto/schemaValidationResult';
import {
  CURRENT_VERSION_NUMBER,
  INITIAL_ENTITY_FIELDS,
  USER_ENTITY_NAME,
  USER_ENTITY_FIELDS,
  DEFAULT_ENTITIES,
  DEFAULT_PERMISSIONS
} from './constants';
import {
  prepareDeletedItemName,
  revertDeletedItemName
} from 'src/util/softDelete';

import {
  EnumPendingChangeResourceType,
  EnumPendingChangeAction
} from '../app/dto';

import {
  CreateOneEntityFieldArgs,
  CreateOneEntityFieldByDisplayNameArgs,
  UpdateOneEntityFieldArgs,
  EntityFieldCreateInput,
  EntityFieldUpdateInput,
  CreateOneEntityArgs,
  FindOneEntityArgs,
  UpdateOneEntityArgs,
  CreateOneEntityVersionArgs,
  FindManyEntityVersionArgs,
  DeleteOneEntityArgs,
  UpdateEntityPermissionArgs,
  LockEntityArgs,
  FindManyEntityFieldArgs,
  EntityWhereInput,
  UpdateEntityPermissionRolesArgs,
  UpdateEntityPermissionFieldRolesArgs,
  AddEntityPermissionFieldArgs,
  DeleteEntityPermissionFieldArgs
} from './dto';
import { EnumEntityAction } from 'src/enums/EnumEntityAction';

type EntityInclude = Omit<
  EntityVersionInclude,
  'entityFields' | 'entityPermissions' | 'entity'
> & {
  fields?: boolean;
  permissions?: boolean | FindManyEntityPermissionArgs;
};

export type BulkEntityFieldData = Omit<
  EntityField,
  'id' | 'createdAt' | 'updatedAt' | 'permanentId' | 'properties'
> & { properties: JsonObject };

export type BulkEntityData = Omit<
  Entity,
  'id' | 'createdAt' | 'updatedAt' | 'appId' | 'app' | 'fields'
> & {
  id?: string;
  fields: BulkEntityFieldData[];
};

/**
 * Expect format for entity field name, matches the format of JavaScript variable name
 */
const NAME_REGEX = /^(?![0-9])[a-zA-Z0-9$_]+$/;
export const NAME_VALIDATION_ERROR_MESSAGE =
  'Name must only contain letters, numbers, the dollar sign, or the underscore character and must not start with a number';

@Injectable()
export class EntityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jsonSchemaValidationService: JsonSchemaValidationService
  ) {}

  async entity(args: FindOneEntityArgs): Promise<Entity | null> {
    const entity = await this.prisma.entity.findMany({
      where: {
        id: args.where.id,
        deletedAt: null
      },
      take: 1
    });

    if (isEmpty(entity)) {
      throw new Error(`Can't find Entity ${args.where.id} `);
    }

    return entity[0];
  }

  async entities(args: FindManyEntityArgs): Promise<Entity[]> {
    return this.prisma.entity.findMany({
      ...args,
      where: {
        ...args.where,
        deletedAt: null
      }
    });
  }

  /** @todo replace with newer Prisma */
  async findFirst(args: FindManyEntityArgs): Promise<Entity | null> {
    const [first] = await this.entities({ ...args, take: 1 });
    return first || null;
  }

  async getEntitiesByVersions(args: {
    where: Omit<EntityVersionWhereInput, 'entity'>;
    include?: EntityInclude;
  }): Promise<Entity[]> {
    const { fields, permissions, ...rest } = args.include;
    const entityVersions = await this.prisma.entityVersion.findMany({
      where: {
        ...args.where,
        deleted: null
      },
      include: {
        ...rest,
        entity: true,
        fields: fields,
        permissions: permissions
      }
    });

    return entityVersions.map(({ entity, fields, permissions }) => {
      return {
        ...entity,
        fields: fields,
        permissions: permissions
      };
    });
  }

  async createOneEntity(
    args: CreateOneEntityArgs,
    user: User
  ): Promise<Entity> {
    const newEntity = await this.prisma.entity.create({
      data: {
        ...args.data,
        lockedAt: new Date(),
        lockedByUser: {
          connect: {
            id: user.id
          }
        },
        versions: {
          create: {
            commit: undefined,
            versionNumber: CURRENT_VERSION_NUMBER,
            name: args.data.name,
            displayName: args.data.displayName,
            pluralDisplayName: args.data.pluralDisplayName,
            description: args.data.description,
            permissions: {
              create: DEFAULT_PERMISSIONS
            }

            /**@todo: check how to use bulk insert while controlling the order of the insert (createdAt must be ordered correctly) */
            // entityFields: {
            //   create: INITIAL_ENTITY_FIELDS
            // }
          }
        }
      }
    });

    await this.prisma.entityField.create({
      data: {
        ...INITIAL_ENTITY_FIELDS[0],
        entityVersion: {
          connect: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            entityId_versionNumber: {
              entityId: newEntity.id,
              versionNumber: CURRENT_VERSION_NUMBER
            }
          }
        }
      }
    });
    await this.prisma.entityField.create({
      data: {
        ...INITIAL_ENTITY_FIELDS[1],
        entityVersion: {
          connect: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            entityId_versionNumber: {
              entityId: newEntity.id,
              versionNumber: CURRENT_VERSION_NUMBER
            }
          }
        }
      }
    });
    await this.prisma.entityField.create({
      data: {
        ...INITIAL_ENTITY_FIELDS[2],
        entityVersion: {
          connect: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            entityId_versionNumber: {
              entityId: newEntity.id,
              versionNumber: CURRENT_VERSION_NUMBER
            }
          }
        }
      }
    });
    return newEntity;
  }

  async createDefaultEntities(appId: string, user: User): Promise<void> {
    return this.bulkCreateEntities(appId, user, DEFAULT_ENTITIES);
  }

  /**
   * Bulk creates entities
   * @param appId the app to bulk create entities for
   * @param user the user to associate with the entities creation
   * @param entities the entities to create
   */
  async bulkCreateEntities(
    appId: string,
    user: User,
    entities: BulkEntityData[]
  ): Promise<void> {
    await Promise.all(
      entities.map(entity => {
        const names = pick(entity, [
          'name',
          'displayName',
          'pluralDisplayName',
          'description'
        ]);
        return this.prisma.entity.create({
          data: {
            id: entity.id, //when id is provided (not undefined) we use it, otherwise prisma will generate an ID
            ...names,
            app: { connect: { id: appId } },
            lockedAt: new Date(),
            lockedByUser: {
              connect: {
                id: user.id
              }
            },
            versions: {
              create: {
                ...names,
                commit: undefined,
                versionNumber: CURRENT_VERSION_NUMBER,
                permissions: {
                  create: DEFAULT_PERMISSIONS
                },

                fields: {
                  create: entity.fields
                }
              }
            }
          }
        });
      })
    );
  }

  /**
   * Soft delete an entity.
   * This function renames the following fields in order to allow future creation of entities with the same name:
   * name, displayName, pluralDisplayName.
   * The fields are prefixed with the entity id to be able to restore the original name on rollback
   *
   * @param args
   * @param user
   */
  async deleteOneEntity(
    args: DeleteOneEntityArgs,
    user: User
  ): Promise<Entity | null> {
    const entity = await this.acquireLock(args, user);

    if (entity.name === USER_ENTITY_NAME) {
      throw new ConflictException(
        `The 'user' entity is a reserved entity and it cannot be deleted`
      );
    }

    return this.prisma.entity.update({
      where: args.where,
      data: {
        name: prepareDeletedItemName(entity.name, entity.id),
        displayName: prepareDeletedItemName(entity.displayName, entity.id),
        pluralDisplayName: prepareDeletedItemName(
          entity.pluralDisplayName,
          entity.id
        ),
        deletedAt: new Date(),
        versions: {
          update: {
            where: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              entityId_versionNumber: {
                entityId: args.where.id,
                versionNumber: CURRENT_VERSION_NUMBER
              }
            },
            data: {
              deleted: true
            }
          }
        }
      }
    });
  }

  async getChangedEntities(appId: string, userId: string) {
    const changedEntity = await this.prisma.entity.findMany({
      where: {
        lockedByUserId: userId,
        appId
      },
      include: {
        lockedByUser: true,
        versions: {
          orderBy: {
            versionNumber: SortOrder.desc
          },
          /**find the first two versions to decide whether it is an update or a create */
          take: 2
        }
      }
    });

    return changedEntity.map(entity => {
      const [lastVersion] = entity.versions;
      const action = entity.deletedAt
        ? EnumPendingChangeAction.Delete
        : entity.versions.length > 1
        ? EnumPendingChangeAction.Update
        : EnumPendingChangeAction.Create;

      entity.versions = undefined; /**remove the versions data - it will only be returned if explicitly asked by gql */

      //prepare name fields for display
      if (action === EnumPendingChangeAction.Delete) {
        entity.name = revertDeletedItemName(entity.name, entity.id);
        entity.displayName = revertDeletedItemName(
          entity.displayName,
          entity.id
        );
        entity.pluralDisplayName = revertDeletedItemName(
          entity.pluralDisplayName,
          entity.id
        );
      }

      return {
        resourceId: entity.id,
        action: action,
        resourceType: EnumPendingChangeResourceType.Entity,
        versionNumber: lastVersion.versionNumber + 1,
        resource: entity
      };
    });
  }

  async updateOneEntity(
    args: UpdateOneEntityArgs,
    user: User
  ): Promise<Entity | null> {
    /**@todo: add validation on updated fields. most fields cannot be updated once the entity was deployed */

    const entity = await this.acquireLock(args, user);

    if (entity.name === USER_ENTITY_NAME) {
      if (args.data.name && args.data.name !== USER_ENTITY_NAME) {
        throw new ConflictException(
          `The 'user' entity is a reserved entity and its name cannot be updated`
        );
      }
    }
    return this.prisma.entity.update({
      where: { ...args.where },
      data: {
        ...args.data,
        versions: {
          update: {
            where: {
              // eslint-disable-next-line @typescript-eslint/camelcase, @typescript-eslint/naming-convention
              entityId_versionNumber: {
                entityId: args.where.id,
                versionNumber: CURRENT_VERSION_NUMBER
              }
            },
            data: {
              name: args.data.name,
              displayName: args.data.displayName,
              pluralDisplayName: args.data.pluralDisplayName,
              description: args.data.description
            }
          }
        }
      }
    });
  }

  //The function must only be used from a @FieldResolver on Entity, otherwise it may return fields of a deleted entity
  async getEntityFields(
    entityId: string,
    versionNumber: number,
    args: FindManyEntityFieldArgs
  ): Promise<EntityField[]> {
    const entityFields = await this.prisma.entityField.findMany({
      ...args,
      where: {
        ...args.where,
        entityVersion: {
          entityId: entityId,
          versionNumber: versionNumber
        }
      }
    });

    return entityFields;
  }

  // Tries to acquire a lock on the given entity for the given user.
  // The function checks that the given entity is not already locked by another user
  // If the current user already has a lock on the entity, the function complete successfully
  // The function also check that the given entity was not "deleted".
  async acquireLock(args: LockEntityArgs, user: User): Promise<Entity | null> {
    const entityId = args.where.id;

    const entities = await this.prisma.entity.findMany({
      where: {
        id: entityId,
        deletedAt: null
      },
      take: 1
    });

    if (isEmpty(entities)) {
      throw new Error(`Can't find Entity ${entityId} `);
    }

    const [entity] = entities;

    if (entity.lockedByUserId === user.id) {
      return entity;
    }

    if (entity.lockedByUserId) {
      throw new Error(
        `Entity ${entityId} is already locked by another user - ${entity.lockedByUserId} `
      );
    }

    return this.prisma.entity.update({
      where: {
        id: entityId
      },
      data: {
        lockedByUser: {
          connect: {
            id: user.id
          }
        },
        lockedAt: new Date()
      }
    });
  }

  async releaseLock(entityId: string): Promise<Entity | null> {
    /**@todo: consider adding validation on the current user locking the entity */
    return this.prisma.entity.update({
      where: {
        id: entityId
      },
      data: {
        lockedByUser: {
          disconnect: true
        },
        lockedAt: null
      }
    });
  }

  async createVersion(
    args: CreateOneEntityVersionArgs
  ): Promise<EntityVersion> {
    /**@todo: consider adding validation on the current user locking the entity */

    const entityId = args.data.entity.connect.id;
    const entityVersions = await this.prisma.entityVersion.findMany({
      where: {
        entity: { id: entityId }
      },
      orderBy: {
        versionNumber: SortOrder.asc
      }
    });

    const firstEntityVersion = head(entityVersions);
    const lastEntityVersion = last(entityVersions);
    if (!firstEntityVersion || !lastEntityVersion) {
      throw new Error(`Entity ${entityId} has no versions`);
    }
    const lastVersionNumber = lastEntityVersion.versionNumber;

    const nextVersionNumber = lastVersionNumber + 1;

    //create the new version
    const newEntityVersion = await this.prisma.entityVersion.create({
      data: {
        name: firstEntityVersion.name,
        displayName: firstEntityVersion.displayName,
        pluralDisplayName: firstEntityVersion.pluralDisplayName,
        description: firstEntityVersion.description,
        commit: {
          connect: {
            id: args.data.commit.connect.id
          }
        },
        versionNumber: nextVersionNumber,
        entity: {
          connect: {
            id: args.data.entity.connect.id
          }
        }
      }
    });

    return this.cloneVersionData(firstEntityVersion.id, newEntityVersion.id);
  }

  async discardPendingChanges(
    entityId: string,
    userId: string
  ): Promise<Entity> {
    const entityVersions = await this.prisma.entityVersion.findMany({
      where: {
        entity: { id: entityId }
      },
      orderBy: {
        versionNumber: SortOrder.asc
      },
      include: {
        entity: true
      }
    });

    const firstEntityVersion = head(entityVersions);
    const lastEntityVersion = last(entityVersions);

    if (!firstEntityVersion || !lastEntityVersion) {
      throw new Error(`Entity ${entityId} has no versions `);
    }

    if (firstEntityVersion.entity.lockedByUserId !== userId) {
      throw new Error(
        `Cannot discard pending changes on Entity ${entityId} since it is not currently locked by the requesting user `
      );
    }

    await this.cloneVersionData(lastEntityVersion.id, firstEntityVersion.id);

    return this.releaseLock(entityId);
  }

  private async cloneVersionData(
    sourceVersionId: string,
    targetVersionId: string
  ): Promise<EntityVersion> {
    const sourceVersion = await this.prisma.entityVersion.findOne({
      where: {
        id: sourceVersionId
      },
      include: {
        fields: true,
        permissions: {
          include: {
            permissionRoles: true,
            permissionFields: {
              include: {
                permissionRoles: true,
                field: true
              }
            }
          }
        }
      }
    });

    if (!sourceVersion) {
      throw new Error(`Can't find source (Entity Version ${sourceVersionId})`);
    }

    let targetVersion = await this.prisma.entityVersion.findOne({
      where: {
        id: targetVersionId
      }
    });

    if (!targetVersion) {
      throw new Error(`Can't find target (Entity Version ${targetVersionId})`);
    }

    // Clear any existing fields and permissions when discarding changes and rolling back to previous version
    if (targetVersion.versionNumber === CURRENT_VERSION_NUMBER) {
      //We use separate actions since prisma does not yet support CASCADE DELETE
      //First delete entityPermissionField and entityPermissionRole
      await this.prisma.entityPermissionField.deleteMany({
        where: {
          entityVersionId: targetVersionId
        }
      });

      await this.prisma.entityPermissionRole.deleteMany({
        where: {
          entityVersionId: targetVersionId
        }
      });

      targetVersion = await this.prisma.entityVersion.update({
        where: {
          id: targetVersionId
        },
        data: {
          fields: {
            deleteMany: {
              entityVersionId: targetVersionId
            }
          },
          permissions: {
            deleteMany: {
              entityVersionId: targetVersionId
            }
          }
        }
      });
    }

    // Duplicate the fields of the source version, omitting entityVersionId and
    // id properties.
    const duplicatedFields = sourceVersion.fields.map(field =>
      omit(field, ['entityVersionId', 'id'])
    );

    const names = pick(sourceVersion, [
      'name',
      'displayName',
      'pluralDisplayName',
      'description'
    ]);

    //update the target version with its fields, and the its parent entity
    targetVersion = await this.prisma.entityVersion.update({
      where: {
        id: targetVersionId
      },
      data: {
        //when the source target is flagged as deleted (commit on DELETE action), do not update the parent entity
        entity: sourceVersion.deleted
          ? undefined
          : {
              update: {
                ...names,
                deletedAt: null
              }
            },
        ...names,
        fields: {
          create: duplicatedFields
        }
      }
    });

    //prepare the permissions object
    const createPermissionsData: EntityPermissionCreateManyWithoutEntityVersionInput = {
      create: sourceVersion.permissions.map(permission => {
        return {
          action: permission.action,
          type: permission.type,
          permissionRoles: {
            create: permission.permissionRoles.map(permissionRole => {
              return {
                appRole: {
                  connect: {
                    id: permissionRole.appRoleId
                  }
                }
              };
            })
          },
          permissionFields: {
            create: permission.permissionFields.map(permissionField => {
              return {
                field: {
                  connect: {
                    // eslint-disable-next-line @typescript-eslint/camelcase, @typescript-eslint/naming-convention
                    entityVersionId_permanentId: {
                      entityVersionId: targetVersionId,
                      permanentId: permissionField.fieldPermanentId
                    }
                  }
                },
                permissionRoles: {
                  connect: permissionField.permissionRoles.map(fieldRole => {
                    return {
                      // eslint-disable-next-line @typescript-eslint/camelcase, @typescript-eslint/naming-convention
                      entityVersionId_action_appRoleId: {
                        action: fieldRole.action,
                        entityVersionId: targetVersionId,
                        appRoleId: fieldRole.appRoleId
                      }
                    };
                  })
                }
              };
            })
          }
        };
      })
    };

    targetVersion = await this.prisma.entityVersion.update({
      where: {
        id: targetVersionId
      },
      data: {
        permissions: createPermissionsData
      }
    });

    return targetVersion;
  }

  //The function must only be used from a @FieldResolver on Entity, otherwise it may return versions of a deleted entity
  async getVersions(args: FindManyEntityVersionArgs): Promise<EntityVersion[]> {
    return this.prisma.entityVersion.findMany(args);
  }

  async getLatestVersions(args: {
    where: EntityWhereInput;
  }): Promise<EntityVersion[]> {
    return this.prisma.entityVersion.findMany({
      ...args,
      where: {
        versionNumber: CURRENT_VERSION_NUMBER,
        entity: {
          ...args.where,
          appId: args.where.app.id,
          deletedAt: null
        }
      }
    });
  }

  async getVersionCommit(entityVersionId: string): Promise<Commit> {
    const version = this.prisma.entityVersion.findOne({
      where: {
        id: entityVersionId
      }
    });

    return version.commit();
  }

  /*validate that the selected entity ID exist in the current app and it is a persistent entity */
  async isEntityInSameApp(entityId: string, appId: string): Promise<boolean> {
    const entities = await this.prisma.entity.findMany({
      where: {
        id: entityId,
        app: {
          id: appId
        },
        deletedAt: null
      }
    });

    return entities && entities.length > 0;
  }

  /**
   * Validate that all the listed field names exist in the entity
   * Returns a set of non matching field names
   */
  async validateAllFieldsExist(
    entityId: string,
    fieldNames: string[]
  ): Promise<Set<string>> {
    const uniqueNames = new Set(fieldNames);

    const matchingFields = await this.prisma.entityField.findMany({
      where: {
        name: {
          in: Array.from(uniqueNames)
        },
        entityVersion: {
          entityId: entityId,
          versionNumber: CURRENT_VERSION_NUMBER
        }
      },
      select: { name: true }
    });

    const matchingNames = new Set(matchingFields.map(({ name }) => name));

    return difference(uniqueNames, matchingNames);
  }

  async updateEntityPermission(
    args: UpdateEntityPermissionArgs,
    user: User
  ): Promise<EntityPermission> {
    await this.acquireLock(args, user);

    const entityVersion = await this.prisma.entityVersion.findOne({
      where: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        entityId_versionNumber: {
          entityId: args.where.id,
          versionNumber: CURRENT_VERSION_NUMBER
        }
      }
    });

    const entityVersionId = entityVersion.id;

    return this.prisma.entityPermission.upsert({
      create: {
        ...args.data,
        entityVersion: {
          connect: {
            id: entityVersionId
          }
        }
      },
      update: {
        type: args.data.type
      },
      where: {
        // eslint-disable-next-line @typescript-eslint/camelcase,@typescript-eslint/naming-convention
        entityVersionId_action: {
          entityVersionId: entityVersionId,
          action: args.data.action
        }
      }
    });
  }

  async updateEntityPermissionRoles(
    args: UpdateEntityPermissionRolesArgs,
    user: User
  ): Promise<EntityPermission> {
    await this.acquireLock(
      { where: { id: args.data.entity.connect.id } },
      user
    );

    const entityVersion = await this.prisma.entityVersion.findOne({
      where: {
        // eslint-disable-next-line @typescript-eslint/camelcase,@typescript-eslint/naming-convention
        entityId_versionNumber: {
          entityId: args.data.entity.connect.id,
          versionNumber: CURRENT_VERSION_NUMBER
        }
      }
    });
    const entityVersionId = entityVersion.id;

    const promises: Promise<any>[] = [];

    //add new roles
    if (!isEmpty(args.data.addRoles)) {
      const createMany = args.data.addRoles.map(role => {
        return {
          appRole: {
            connect: {
              id: role.id
            }
          }
        };
      });

      promises.push(
        this.prisma.entityPermission.update({
          where: {
            // eslint-disable-next-line @typescript-eslint/camelcase,@typescript-eslint/naming-convention
            entityVersionId_action: {
              entityVersionId: entityVersionId,
              action: args.data.action
            }
          },
          data: {
            permissionRoles: {
              create: createMany
            }
          }
        })
      );
    }

    //delete existing roles
    if (!isEmpty(args.data.deleteRoles)) {
      promises.push(
        this.prisma.entityPermissionRole.deleteMany({
          where: {
            appRoleId: {
              in: args.data.deleteRoles.map(role => role.id)
            }
          }
        })
      );
    }
    await Promise.all(promises);

    const results = await this.prisma.entityPermission.findMany({
      where: {
        entityVersion: {
          entityId: args.data.entity.connect.id,
          versionNumber: CURRENT_VERSION_NUMBER
        },
        action: args.data.action
      },
      include: {
        permissionRoles: {
          include: {
            appRole: true
          }
        },
        permissionFields: {
          include: {
            field: true,
            permissionRoles: {
              include: {
                appRole: true
              }
            }
          }
        }
      },
      take: 1
    });

    return results[0];
  }

  async getPermissions(
    entityId: string,
    action: EnumEntityAction = undefined
  ): Promise<EntityPermission[]> {
    return this.getVersionPermissions(entityId, CURRENT_VERSION_NUMBER, action);
  }

  async getVersionPermissions(
    entityId: string,
    versionNumber: number,
    action: EnumEntityAction = undefined
  ): Promise<EntityPermission[]> {
    return this.prisma.entityPermission.findMany({
      where: {
        entityVersion: {
          entityId: entityId,
          versionNumber: versionNumber,
          entity: {
            deletedAt: null
          }
        },
        action: action
      },
      include: {
        permissionRoles: {
          include: {
            appRole: true
          }
        },
        permissionFields: {
          include: {
            field: true,
            permissionRoles: {
              include: {
                appRole: true
              }
            }
          }
        }
      }
    });
  }

  async addEntityPermissionField(
    args: AddEntityPermissionFieldArgs,
    user: User
  ): Promise<EntityPermissionField> {
    await this.acquireLock(
      { where: { id: args.data.entity.connect.id } },
      user
    );

    const nonMatchingNames = await this.validateAllFieldsExist(
      args.data.entity.connect.id,
      [args.data.fieldName]
    );
    if (nonMatchingNames.size > 0) {
      throw new NotFoundException(
        `Invalid field selected: ${Array.from(nonMatchingNames).join(', ')}`
      );
    }

    const entityVersion = await this.prisma.entityVersion.findOne({
      where: {
        // eslint-disable-next-line @typescript-eslint/camelcase,@typescript-eslint/naming-convention
        entityId_versionNumber: {
          entityId: args.data.entity.connect.id,
          versionNumber: CURRENT_VERSION_NUMBER
        }
      }
    });
    const entityVersionId = entityVersion.id;

    return this.prisma.entityPermissionField.create({
      data: {
        field: {
          connect: {
            // eslint-disable-next-line @typescript-eslint/camelcase,@typescript-eslint/naming-convention
            entityVersionId_name: {
              entityVersionId: entityVersionId,
              name: args.data.fieldName
            }
          }
        },
        permission: {
          connect: {
            // eslint-disable-next-line @typescript-eslint/camelcase,@typescript-eslint/naming-convention
            entityVersionId_action: {
              entityVersionId: entityVersionId,
              action: args.data.action
            }
          }
        }
      },
      include: {
        field: true
      }
    });
  }

  async deleteEntityPermissionField(
    args: DeleteEntityPermissionFieldArgs,
    user: User
  ): Promise<EntityPermissionField> {
    await this.acquireLock({ where: { id: args.where.entityId } }, user);

    const permissionField = await this.prisma.entityPermissionField.findMany({
      where: {
        permission: {
          entityVersion: {
            entityId: args.where.entityId,
            versionNumber: CURRENT_VERSION_NUMBER
          },
          action: args.where.action
        },
        fieldPermanentId: args.where.fieldPermanentId
      }
    });

    if (isEmpty(permissionField)) {
      throw new Error(`Record not found`);
    }

    const id = permissionField[0].id;

    return this.prisma.entityPermissionField.delete({
      where: {
        id: id
      },
      include: {
        field: true
      }
    });
  }

  async updateEntityPermissionFieldRoles(
    args: UpdateEntityPermissionFieldRolesArgs,
    user: User
  ): Promise<EntityPermissionField> {
    const promises: Promise<any>[] = [];

    const field = await this.prisma.entityPermissionField.findOne({
      where: {
        id: args.data.permissionField.connect.id
      },
      include: {
        permission: {
          include: {
            entityVersion: true
          }
        }
      }
    });

    if (!field) {
      throw new NotFoundException(
        `Cannot find entity permission field ${args.data.permissionField.connect.id}`
      );
    }

    const { entityId, versionNumber } = field.permission.entityVersion;

    if (versionNumber !== CURRENT_VERSION_NUMBER) {
      throw new NotFoundException(
        `Cannot update settings on committed versions. Requested version ${versionNumber}`
      );
    }

    await this.acquireLock({ where: { id: entityId } }, user);

    //add new roles
    if (!isEmpty(args.data.addPermissionRoles)) {
      const createMany = args.data.addPermissionRoles.map(permissionRole => {
        return {
          id: permissionRole.id
        };
      });

      promises.push(
        this.prisma.entityPermissionField.update({
          where: {
            id: args.data.permissionField.connect.id
          },
          data: {
            permissionRoles: {
              connect: createMany
            }
          }
        })
      );
    }

    //delete existing roles
    if (!isEmpty(args.data.deletePermissionRoles)) {
      const deleteMany = args.data.deletePermissionRoles.map(permissionRole => {
        return {
          id: permissionRole.id
        };
      });

      promises.push(
        this.prisma.entityPermissionField.update({
          where: {
            id: args.data.permissionField.connect.id
          },
          data: {
            permissionRoles: {
              disconnect: deleteMany
            }
          }
        })
      );
    }
    await Promise.all(promises);

    return this.prisma.entityPermissionField.findOne({
      where: {
        id: args.data.permissionField.connect.id
      },
      include: {
        field: true,
        permissionRoles: {
          include: {
            appRole: true
          }
        }
      }
    });
  }

  private async validateFieldProperties(
    dataType: EnumDataType,
    properties: JsonValue
  ): Promise<SchemaValidationResult> {
    try {
      const data = properties;
      const schema = getSchemaForDataType(dataType);
      const schemaValidation = await this.jsonSchemaValidationService.validateSchema(
        schema,
        data
      );

      //if schema is not valid - return false, otherwise continue with ret of the checks
      if (!schemaValidation.isValid) {
        return schemaValidation;
      }

      switch (dataType) {
        case EnumDataType.Lookup:
          //check if the actual selected entity exist and can be referenced by this field
          break;

        case (EnumDataType.OptionSet, EnumDataType.MultiSelectOptionSet):
          //check if the actual selected option set exist and can be referenced by this field
          break;

        //todo: add other data type specific checks
        default:
          break;
      }

      return schemaValidation;
    } catch (error) {
      return new SchemaValidationResult(false, error);
    }
  }

  /** Validate name value conforms expected format */
  private static validateFieldName(name: string): void {
    if (!NAME_REGEX.test(name)) {
      throw new ConflictException(NAME_VALIDATION_ERROR_MESSAGE);
    }
  }

  async createFieldByDisplayName(
    args: CreateOneEntityFieldByDisplayNameArgs,
    user: User
  ): Promise<EntityField> {
    const lowerCaseName = args.data.displayName.toLowerCase();
    const name = camelCase(args.data.displayName);
    let dataType: EnumDataType = EnumDataType.SingleLineText;
    let properties = {};
    properties = {
      maxLength: 1000
    };

    if (lowerCaseName.includes('date')) {
      dataType = EnumDataType.DateTime;
      properties = {
        timeZone: 'localTime',
        dateOnly: false
      };
    } else if (lowerCaseName.includes('description')) {
      dataType = EnumDataType.MultiLineText;
      properties = {
        maxLength: 1000
      };
    } else if (lowerCaseName.includes('email')) {
      dataType = EnumDataType.Email;
      properties = {};
    } else if (lowerCaseName.includes('status')) {
      dataType = EnumDataType.OptionSet;
      properties = {
        options: [{ label: 'Option 1', value: 'Option1' }]
      };
    } else if (lowerCaseName.startsWith('is')) {
      dataType = EnumDataType.Boolean;
      properties = {};
    } else {
      const existingEntity = await this.prisma.entity.findOne({
        where: {
          id: args.data.entity.connect.id
        }
      });

      if (!existingEntity) {
        throw new DataConflictError(
          `Can't find Entity ${args.data.entity.connect.id} `
        );
      }

      const [entity] = await this.prisma.entity.findMany({
        where: {
          appId: existingEntity.appId,
          // eslint-disable-next-line @typescript-eslint/camelcase, @typescript-eslint/naming-convention
          AND: [
            {
              name: {
                equals: name,
                mode: QueryMode.insensitive
              },
              // eslint-disable-next-line @typescript-eslint/camelcase, @typescript-eslint/naming-convention
              OR: [
                {
                  displayName: {
                    equals: name,
                    mode: QueryMode.insensitive
                  }
                },
                {
                  pluralDisplayName: {
                    equals: name,
                    mode: QueryMode.insensitive
                  }
                }
              ]
            }
          ]
        }
      });

      if (entity) {
        dataType = EnumDataType.Lookup;
        properties = {
          relatedEntityId: entity.id,
          allowMultipleSelection:
            entity.pluralDisplayName.toLowerCase() === lowerCaseName
              ? true
              : false
        };
      }
    }

    return this.createField(
      {
        data: {
          dataType: dataType,
          name: name,
          displayName: name,
          properties: properties,
          required: false,
          searchable: false,
          description: '',
          entity: args.data.entity
        }
      },
      user
    );
  }

  async validateFieldData(
    data: EntityFieldCreateInput | EntityFieldUpdateInput
  ): Promise<void> {
    // Validate name
    EntityService.validateFieldName(data.name);

    // Validate the properties
    const validationResults = await this.validateFieldProperties(
      EnumDataType[data.dataType],
      data.properties
    );

    if (!validationResults.isValid) {
      throw new ConflictException(
        `Cannot validate the Entity Field Properties. ${validationResults.errorText}`
      );
    }
  }

  async createField(
    args: CreateOneEntityFieldArgs,
    user: User
  ): Promise<EntityField> {
    // Extract entity from data
    const { entity, ...data } = args.data;

    if (args.data.dataType === EnumDataType.Id) {
      throw new DataConflictError(
        `The ID data type cannot be used to created new fields`
      );
    }

    // Validate entity field data
    await this.validateFieldData(data);

    const existingEntity = await this.acquireLock(
      { where: { id: entity.connect.id } },
      user
    );

    if (existingEntity.name === USER_ENTITY_NAME) {
      if (USER_ENTITY_FIELDS.includes(args.data.name.toLowerCase())) {
        throw new ConflictException(
          `The field name '${args.data.name}' is a reserved field name and it cannot be used on the 'user' entity`
        );
      }
    }

    // Get field's entity current version
    const [currentEntityVersion] = await this.prisma.entityVersion.findMany({
      where: {
        entity: { id: entity.connect.id }
      },
      orderBy: { versionNumber: SortOrder.asc },
      take: 1,
      select: { id: true }
    });

    // Create entity field
    return this.prisma.entityField.create({
      data: {
        ...data,
        entityVersion: { connect: { id: currentEntityVersion.id } }
      }
    });
  }

  async updateField(
    args: UpdateOneEntityFieldArgs,
    user: User
  ): Promise<EntityField> {
    //Validate the field is linked to current version (other versions cannot be updated)
    const entityField = await this.prisma.entityField.findOne({
      where: { id: args.where.id },
      include: {
        entityVersion: true
      }
    });

    if (!entityField) {
      throw new NotFoundException(`Cannot find entity field ${args.where.id}`);
    }

    if (entityField.entityVersion.versionNumber !== CURRENT_VERSION_NUMBER) {
      throw new ConflictException(
        `Cannot update fields of previous versions (version ${entityField.entityVersion.versionNumber}) `
      );
    }

    if (entityField.name === 'id') {
      throw new ConflictException('The ID field cannot be deleted or updated');
    }

    if (args.data.dataType === EnumDataType.Id) {
      throw new ConflictException(
        `The ID data type cannot be used to create new fields`
      );
    }

    // Validate entity field data
    await this.validateFieldData(args.data);

    /**
     * @todo validate the field was not published - only specific properties of
     * fields that were already published can be updated
     */

    const entity = await this.acquireLock(
      { where: { id: entityField.entityVersion.entityId } },
      user
    );

    if (args.data.name && entity.name === USER_ENTITY_NAME) {
      if (USER_ENTITY_FIELDS.includes(args.data.name.toLowerCase())) {
        throw new ConflictException(
          `The field name '${args.data.name}' is a reserved field name and it cannot be used on the 'user' entity`
        );
      }
    }

    return this.prisma.entityField.update(args);
  }

  /**@todo: replace EntityFieldDeleteArgs from @prisma/client with DTO  */
  async deleteField(
    args: EntityFieldDeleteArgs,
    user: User
  ): Promise<EntityField | null> {
    //Validate the field is linked to current version (other versions cannot be updated)
    const entityField = await this.prisma.entityField.findOne({
      where: { id: args.where.id },
      include: {
        entityVersion: true
      }
    });

    if (!entityField) {
      throw new NotFoundException(`Cannot find entity field ${args.where.id}`);
    }

    if (entityField.entityVersion.versionNumber !== CURRENT_VERSION_NUMBER) {
      throw new ConflictException(
        `Cannot delete fields of previous versions (version ${entityField.entityVersion.versionNumber}) `
      );
    }

    await this.acquireLock(
      { where: { id: entityField.entityVersion.entityId } },
      user
    );

    return this.prisma.entityField.delete(args);
  }
}
