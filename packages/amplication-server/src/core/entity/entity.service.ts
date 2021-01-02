/* eslint-disable @typescript-eslint/no-use-before-define */

import {
  Injectable,
  NotFoundException,
  ConflictException
} from '@nestjs/common';
import { DataConflictError } from 'src/errors/DataConflictError';
import {
  SortOrder,
  EntityPermissionCreateManyWithoutEntityVersionInput,
  EntityVersionInclude,
  FindManyEntityPermissionArgs,
  EntityVersionWhereInput,
  FindManyEntityArgs,
  QueryMode,
  FindOneEntityFieldArgs
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
import { JsonObject } from 'type-fest';
import { PrismaService } from 'nestjs-prisma';
import { getSchemaForDataType } from '@amplication/data';
import { JsonSchemaValidationService } from 'src/services/jsonSchemaValidation.service';
import { SchemaValidationResult } from 'src/dto/schemaValidationResult';
import { EnumDataType } from 'src/enums/EnumDataType';
import { EnumEntityAction } from 'src/enums/EnumEntityAction';
import {
  CURRENT_VERSION_NUMBER,
  INITIAL_ENTITY_FIELDS,
  USER_ENTITY_NAME,
  USER_ENTITY_FIELDS,
  DEFAULT_ENTITIES,
  DEFAULT_PERMISSIONS,
  SYSTEM_DATA_TYPES
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
  DeleteEntityFieldArgs,
  UpdateEntityPermissionArgs,
  LockEntityArgs,
  FindManyEntityFieldArgs,
  EntityWhereInput,
  UpdateEntityPermissionRolesArgs,
  UpdateEntityPermissionFieldRolesArgs,
  AddEntityPermissionFieldArgs,
  DeleteEntityPermissionFieldArgs
} from './dto';

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

export type EntityPendingChange = {
  /** The id of the changed entity */
  resourceId: string;
  /** The type of change */
  action: EnumPendingChangeAction;
  resourceType: EnumPendingChangeResourceType.Entity;
  /** The entity version number */
  versionNumber: number;
  /** The entity */
  resource: Entity;
};

/**
 * Expect format for entity field name, matches the format of JavaScript variable name
 */
const NAME_REGEX = /^(?![0-9])[a-zA-Z0-9$_]+$/;
export const NAME_VALIDATION_ERROR_MESSAGE =
  'Name must only contain letters, numbers, the dollar sign, or the underscore character and must not start with a number';

export const DELETE_ONE_USER_ENTITY_ERROR_MESSAGE = `The 'user' entity is a reserved entity and it cannot be deleted`;

const BASE_FIELD: Pick<
  EntityField,
  'required' | 'searchable' | 'description'
> = {
  required: false,
  searchable: false,
  description: ''
};

@Injectable()
export class EntityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jsonSchemaValidationService: JsonSchemaValidationService
  ) {}

  async entity(args: FindOneEntityArgs): Promise<Entity | null> {
    const entity = await this.prisma.entity.findFirst({
      where: {
        id: args.where.id,
        deletedAt: null
      }
    });

    if (!entity) {
      throw new Error(`Cannot find entity where ${JSON.stringify(args.where)}`);
    }

    return entity;
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
      throw new ConflictException(DELETE_ONE_USER_ENTITY_ERROR_MESSAGE);
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

  /**
   * Gets all the entities changed since the last app commit
   * @param appId the app ID to find changes to
   * @param userId the user ID the app ID relates to
   */
  async getChangedEntities(
    appId: string,
    userId: string
  ): Promise<EntityPendingChange[]> {
    const changedEntities = await this.prisma.entity.findMany({
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

    return changedEntities.map(entity => {
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

  async getChangedEntitiesByCommit(commitId: string) {
    const changedEntity = await this.prisma.entity.findMany({
      where: {
        versions: {
          some: {
            commitId: commitId
          }
        }
      },
      include: {
        lockedByUser: true,
        versions: {
          where: {
            commitId: commitId
          }
        }
      }
    });

    return changedEntity.map(entity => {
      const [changedVersion] = entity.versions;
      const action = changedVersion.deleted
        ? EnumPendingChangeAction.Delete
        : changedVersion.versionNumber > 1
        ? EnumPendingChangeAction.Update
        : EnumPendingChangeAction.Create;

      //prepare name fields for display
      if (action === EnumPendingChangeAction.Delete) {
        entity.name = changedVersion.name;
        entity.displayName = changedVersion.displayName;
        entity.pluralDisplayName = changedVersion.pluralDisplayName;
      }

      return {
        resourceId: entity.id,
        action: action,
        resourceType: EnumPendingChangeResourceType.Entity,
        versionNumber: changedVersion.versionNumber,
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
              // eslint-disable-next-line @typescript-eslint/naming-convention
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

  /**
   * Gets the fields associated with an entity. This function assumes the given
   * entity ID is of a non-deleted entity. If it is used on a deleted entity it
   * may return fields even though the entity is deleted.
   * @param entityId The entity ID to find fields for
   * @param args find many entity fields arguments
   * @returns fields of the given entity at the given version that match given arguments
   */
  async getFields(
    entityId: string,
    args: FindManyEntityFieldArgs
  ): Promise<EntityField[]> {
    return this.getVersionFields(entityId, CURRENT_VERSION_NUMBER, args);
  }

  /**
   * Gets the fields associated with an entity version. This function assumes
   * the given entity ID is of a non-deleted entity. If it is used on a deleted
   * entity it may return fields even though the entity is deleted.
   * @param entityId The entity ID to find fields for
   * @param versionNumber the entity version number to find fields for
   * @param args find many entity fields arguments
   * @returns fields of the given entity at the given version that match given arguments
   */
  async getVersionFields(
    entityId: string,
    versionNumber: number,
    args: FindManyEntityFieldArgs
  ): Promise<EntityField[]> {
    return await this.prisma.entityField.findMany({
      ...args,
      where: {
        ...args.where,
        entityVersion: {
          entityId: entityId,
          versionNumber: versionNumber
        }
      }
    });
  }

  // Tries to acquire a lock on the given entity for the given user.
  // The function checks that the given entity is not already locked by another user
  // If the current user already has a lock on the entity, the function complete successfully
  // The function also check that the given entity was not "deleted".
  async acquireLock(args: LockEntityArgs, user: User): Promise<Entity | null> {
    const entityId = args.where.id;

    const entity = await this.entity({
      where: {
        id: entityId
      }
    });

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
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    entityVersionId_permanentId: {
                      entityVersionId: targetVersionId,
                      permanentId: permissionField.fieldPermanentId
                    }
                  }
                },
                permissionRoles: {
                  connect: permissionField.permissionRoles.map(fieldRole => {
                    return {
                      // eslint-disable-next-line @typescript-eslint/naming-convention
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
    const entities = await this.prisma.entity.findMany({
      where: {
        ...args.where,
        appId: args.where.app.id,
        deletedAt: null
      },
      select: {
        versions: {
          where: {
            versionNumber: {
              not: CURRENT_VERSION_NUMBER
            }
          },
          take: 1,
          orderBy: {
            versionNumber: SortOrder.desc
          }
        }
      }
    });

    return entities
      .filter(entity => entity.versions.length > 0)
      .map(entity => entity.versions[0]);
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
        // eslint-disable-next-line @typescript-eslint/naming-convention
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
      orderBy: {
        action: SortOrder.asc
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
        // eslint-disable-next-line @typescript-eslint/naming-convention
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
            // eslint-disable-next-line @typescript-eslint/naming-convention
            entityVersionId_name: {
              entityVersionId: entityVersionId,
              name: args.data.fieldName
            }
          }
        },
        permission: {
          connect: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
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
    properties: JsonObject
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
  async createFieldByDisplayName(
    args: CreateOneEntityFieldByDisplayNameArgs,
    user: User
  ): Promise<EntityField> {
    const entity = await this.entity({
      where: args.data.entity.connect
    });

    if (!entity) {
      throw new DataConflictError(
        `Could not find entity where ${JSON.stringify(
          args.data.entity.connect
        )}`
      );
    }

    const createInput = await this.createFieldCreateInputByDisplayName(
      args,
      entity
    );

    const data = {
      ...BASE_FIELD,
      ...args.data,
      ...createInput
    };

    return this.createField({ data }, user);
  }

  async createFieldCreateInputByDisplayName(
    args: CreateOneEntityFieldByDisplayNameArgs,
    entity: Entity
  ): Promise<{ name: string; dataType: EnumDataType; properties: JsonObject }> {
    const { displayName } = args.data;
    const lowerCaseName = displayName.toLowerCase();
    const name = camelCase(displayName);
    if (lowerCaseName.includes('date')) {
      return {
        name,
        dataType: EnumDataType.DateTime,
        properties: {
          timeZone: 'localTime',
          dateOnly: false
        }
      };
    } else if (lowerCaseName.includes('description')) {
      return {
        name,
        dataType: EnumDataType.MultiLineText,
        properties: {
          maxLength: 1000
        }
      };
    } else if (lowerCaseName.includes('email')) {
      return {
        name,
        dataType: EnumDataType.Email,
        properties: {}
      };
    } else if (lowerCaseName.includes('status')) {
      return {
        name,
        dataType: EnumDataType.OptionSet,
        properties: {
          options: [{ label: 'Option 1', value: 'Option1' }]
        }
      };
    } else if (lowerCaseName.startsWith('is')) {
      return {
        name,
        dataType: EnumDataType.Boolean,
        properties: {}
      };
    } else {
      const relatedEntity = await this.findEntityByName(name, entity.appId);
      if (relatedEntity) {
        const allowMultipleSelection =
          relatedEntity.pluralDisplayName.toLowerCase() === lowerCaseName;
        return {
          name,
          dataType: EnumDataType.Lookup,
          properties: {
            relatedEntityId: relatedEntity.id,
            allowMultipleSelection
          }
        };
      }
    }
    return {
      name,
      dataType: EnumDataType.SingleLineText,
      properties: {
        maxLength: 1000
      }
    };
  }

  private findEntityByName(name: string, appId: string): Promise<Entity> {
    return this.findFirst({
      where: {
        appId,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        AND: [
          {
            name: {
              equals: name,
              mode: QueryMode.insensitive
            },
            // eslint-disable-next-line @typescript-eslint/naming-convention
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
  }

  async validateFieldData(
    data: EntityFieldCreateInput | EntityFieldUpdateInput,
    entity: Entity
  ): Promise<void> {
    // Validate the field's name
    validateFieldName(data.name);

    // Validate the field's dataType is not a system data type
    if (isSystemDataType(data.dataType as EnumDataType)) {
      throw new DataConflictError(
        `The data type ${data.dataType} cannot be used for non-system fields`
      );
    }

    if (isUserEntity(entity)) {
      // Make sure the field's name is not reserved
      if (isReservedUserEntityFieldName(data.name)) {
        throw new DataConflictError(
          `The field name '${data.name}' is a reserved field name and it cannot be used on the 'user' entity`
        );
      }
      // In case the field data type is Lookup make sure it is not required
      if (data.dataType === EnumDataType.Lookup && data.required) {
        throw new DataConflictError(
          'Fields with data type "Lookup" of the entity "User" must not be marked as required. Please unmark the field as required and try again'
        );
      }
    }

    // Validate the field's properties
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
    // Omit entity from received data
    const data = omit(args.data, ['entity']);

    // Get the field's entity and acquire lock to edit it
    const entity = await this.acquireLock(
      { where: args.data.entity.connect },
      user
    );

    // Validate entity field data
    await this.validateFieldData(data, entity);

    // Create entity field
    return this.prisma.entityField.create({
      data: {
        ...data,
        entityVersion: {
          connect: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            entityId_versionNumber: {
              entityId: entity.id,
              versionNumber: CURRENT_VERSION_NUMBER
            }
          }
        }
      }
    });
  }

  async updateField(
    args: UpdateOneEntityFieldArgs,
    user: User
  ): Promise<EntityField> {
    const field = await this.getField({
      where: args.where,
      include: { entityVersion: true }
    });

    if (isSystemDataType(field.dataType as EnumDataType)) {
      throw new ConflictException(
        `Cannot update entity field ${field.name} because fields with data type ${field.dataType} cannot be updated`
      );
    }

    const entity = await this.acquireLock(
      { where: { id: field.entityVersion.entityId } },
      user
    );

    // Validate entity field data
    await this.validateFieldData(args.data, entity);

    /**
     * @todo validate the field was not published - only specific properties of
     * fields that were already published can be updated
     */

    return this.prisma.entityField.update(args);
  }

  async deleteField(
    args: DeleteEntityFieldArgs,
    user: User
  ): Promise<EntityField | null> {
    const field = await this.getField({
      ...args,
      include: {
        entityVersion: true
      }
    });

    if (!field) {
      throw new NotFoundException(`Cannot find entity field ${args.where.id}`);
    }

    if (isSystemDataType(field.dataType as EnumDataType)) {
      throw new ConflictException(
        `Cannot delete entity field ${field.dataType} because fields with the data type ${field.dataType} cannot be deleted`
      );
    }

    await this.acquireLock(
      { where: { id: field.entityVersion.entityId } },
      user
    );

    return this.prisma.entityField.delete(args);
  }

  /**
   * Gets a field according to provided arguments.
   * @param args arguments to find field according to
   * @returns the entity field
   * @throws {NotFoundException} thrown if the field is not found
   */
  private async getField(args: FindOneEntityFieldArgs): Promise<EntityField> {
    const field = await this.prisma.entityField.findFirst({
      ...args,
      where: {
        ...args.where,
        entityVersion: {
          versionNumber: CURRENT_VERSION_NUMBER
        }
      }
    });
    if (!field) {
      throw new NotFoundException(
        `Could not find an entity field for the args: ${JSON.stringify(args)}`
      );
    }
    return field;
  }
}

function validateFieldName(name: string): void {
  if (!NAME_REGEX.test(name)) {
    throw new ConflictException(NAME_VALIDATION_ERROR_MESSAGE);
  }
}

function isSystemDataType(dataType: EnumDataType): boolean {
  return SYSTEM_DATA_TYPES.has(dataType);
}

function isReservedUserEntityFieldName(name: string): boolean {
  return USER_ENTITY_FIELDS.includes(name.toLowerCase());
}

function isUserEntity(entity: Entity): boolean {
  return entity.name === USER_ENTITY_NAME;
}
