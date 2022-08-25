/* eslint-disable @typescript-eslint/no-use-before-define */

import cuid from 'cuid';
import {
  Injectable,
  NotFoundException,
  ConflictException
} from '@nestjs/common';
import { DataConflictError } from '../../errors/DataConflictError';
import { Prisma, PrismaService } from '@amplication/prisma-db';
import { AmplicationError } from '../../errors/AmplicationError';
import { camelCase } from 'camel-case';
import difference from '@extra-set/difference';
import { isEmpty, pick, last, head, omit } from 'lodash';
import {
  Entity,
  EntityField,
  EntityVersion,
  Commit,
  User,
  EntityPermission,
  EntityPermissionField,
  Resource
} from '../../models';
import { JsonObject } from 'type-fest';
import { getSchemaForDataType, types } from '@amplication/code-gen-types';
import { JsonSchemaValidationService } from '../../services/jsonSchemaValidation.service';
import { DiffService } from '../../services/diff.service';
import { SchemaValidationResult } from '../../dto/schemaValidationResult';
import { EnumDataType } from '../../enums/EnumDataType';
import { EnumEntityAction } from '../../enums/EnumEntityAction';
import { isReservedName } from './reservedNames';
import {
  CURRENT_VERSION_NUMBER,
  INITIAL_ENTITY_FIELDS,
  USER_ENTITY_NAME,
  USER_ENTITY_FIELDS,
  DEFAULT_ENTITIES,
  DEFAULT_PERMISSIONS,
  SYSTEM_DATA_TYPES,
  DATA_TYPE_TO_DEFAULT_PROPERTIES
} from './constants';
import {
  prepareDeletedItemName,
  revertDeletedItemName
} from '../../util/softDelete';

import {
  EnumPendingChangeOriginType,
  EnumPendingChangeAction,
  PendingChange
} from '../resource/dto';

import {
  CreateOneEntityFieldArgs,
  CreateOneEntityFieldByDisplayNameArgs,
  UpdateOneEntityFieldArgs,
  CreateDefaultRelatedFieldArgs,
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
  UpdateEntityPermissionRolesArgs,
  UpdateEntityPermissionFieldRolesArgs,
  AddEntityPermissionFieldArgs,
  DeleteEntityPermissionFieldArgs
} from './dto';
import { ReservedNameError } from '../resource/ReservedNameError';

type EntityInclude = Omit<
  Prisma.EntityVersionInclude,
  'entityFields' | 'entityPermissions' | 'entity'
> & {
  fields?: boolean;
  permissions?: boolean | Prisma.EntityPermissionFindManyArgs;
};

export type BulkEntityFieldData = Omit<
  EntityField,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'permanentId'
  | 'properties'
  | 'entityVersionId'
> & {
  permanentId?: string;
  properties: JsonObject;
};

export type BulkEntityData = Omit<
  Entity,
  'id' | 'createdAt' | 'updatedAt' | 'resourceId' | 'resource' | 'fields'
> & {
  id?: string;
  fields: BulkEntityFieldData[];
};

export type EntityPendingChange = {
  /** The id of the changed entity */
  originId: string;
  /** The type of change */
  action: EnumPendingChangeAction;
  originType: EnumPendingChangeOriginType.Entity;
  /** The entity version number */
  versionNumber: number;
  /** The entity */
  origin: Entity;

  resource: Resource;
};

/**
 * Expect format for entity field name, matches the format of JavaScript variable name
 */
const NAME_REGEX = /^(?![0-9])[a-zA-Z0-9$_]+$/;
export const NAME_VALIDATION_ERROR_MESSAGE =
  'Name must only contain letters, numbers, the dollar sign, or the underscore character and must not start with a number';

export const DELETE_ONE_USER_ENTITY_ERROR_MESSAGE = `The 'user' entity is a reserved entity and it cannot be deleted`;

const RELATED_FIELD_ID_DEFINED_NAMES_SHOULD_BE_UNDEFINED_ERROR_MESSAGE =
  'When data.dataType is Lookup and data.properties.relatedFieldId is defined, relatedFieldName and relatedFieldDisplayName must be null';

const RELATED_FIELD_ID_UNDEFINED_AND_NAMES_UNDEFINED_ERROR_MESSAGE =
  'When data.dataType is Lookup, either data.properties.relatedFieldId must be defined or relatedFieldName and relatedFieldDisplayName must not be null and not be empty';

const RELATED_FIELD_NAMES_SHOULD_BE_UNDEFINED_ERROR_MESSAGE =
  'When data.dataType is not Lookup, relatedFieldName and relatedFieldDisplayName must be null';

const BASE_FIELD: Pick<
  EntityField,
  'required' | 'searchable' | 'description' | 'unique'
> = {
  required: false,
  unique: false,
  searchable: true,
  description: ''
};

const NON_COMPARABLE_PROPERTIES = [
  'id',
  'createdAt',
  'updatedAt',
  'versionNumber',
  'commitId',
  'permissionId',
  'entityVersionId',
  'resourceRoleId'
];

@Injectable()
export class EntityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jsonSchemaValidationService: JsonSchemaValidationService,
    private readonly diffService: DiffService
  ) {}

  async entity(args: FindOneEntityArgs): Promise<Entity | null> {
    const entity = await this.prisma.entity.findFirst({
      where: {
        id: args.where.id,
        deletedAt: null
      }
    });

    if (!entity) {
      throw new AmplicationError(
        `Cannot find entity where ${JSON.stringify(args.where)}`
      );
    }

    return entity;
  }

  async entities(args: Prisma.EntityFindManyArgs): Promise<Entity[]> {
    return this.prisma.entity.findMany({
      ...args,
      where: {
        ...args.where,
        deletedAt: null
      }
    });
  }

  async findFirst(args: Prisma.EntityFindManyArgs): Promise<Entity | null> {
    const [first] = await this.entities({ ...args, take: 1 });
    return first || null;
  }

  async getEntitiesByVersions(args: {
    where: Omit<Prisma.EntityVersionWhereInput, 'entity'>;
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
    if (
      args.data?.name?.toLowerCase().trim() ===
      args.data?.pluralDisplayName?.toLowerCase().trim()
    ) {
      throw new AmplicationError(
        `The entity name and plural display name cannot be the same.`
      );
    }
    if (isReservedName(args.data?.name?.toLowerCase().trim())) {
      throw new ReservedNameError(args.data?.name?.toLowerCase().trim());
    }

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

  async createDefaultEntities(resourceId: string, user: User): Promise<void> {
    return this.bulkCreateEntities(resourceId, user, DEFAULT_ENTITIES);
  }

  /**
   * Bulk creates entities
   * @param resourceId the resource to bulk create entities for
   * @param user the user to associate with the entities creation
   * @param entities the entities to create
   */
  async bulkCreateEntities(
    resourceId: string,
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
            resource: { connect: { id: resourceId } },
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
   * Bulk creates fields on existing entities
   * @param user the user to associate with the entities creation
   * @param entityId the entity to bulk create fields for
   * @param fields the fields to create. id must be provided
   */
  async bulkCreateFields(
    user: User,
    entityId: string,
    fields: (BulkEntityFieldData & { permanentId: string })[]
  ): Promise<void> {
    return await this.useLocking(entityId, user, async () => {
      await Promise.all(
        fields.map(field => {
          return this.prisma.entityField.create({
            data: {
              ...field,
              entityVersion: {
                connect: {
                  // eslint-disable-next-line @typescript-eslint/naming-convention
                  entityId_versionNumber: {
                    entityId: entityId,
                    versionNumber: CURRENT_VERSION_NUMBER
                  }
                }
              }
            }
          });
        })
      );
    });
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
    return await this.useLocking(args.where.id, user, async entity => {
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
    });
  }

  /**
   * Gets all the entities changed since the last resource commit
   * @param projectId the resource ID to find changes to
   * @param userId the user ID the resource ID relates to
   */
  async getChangedEntities(
    projectId: string,
    userId: string
  ): Promise<EntityPendingChange[]> {
    const changedEntities = await this.prisma.entity.findMany({
      where: {
        lockedByUserId: userId,
        resource: {
          project: {
            id: projectId
          }
        }
      },
      include: {
        lockedByUser: true,
        resource: true,
        versions: {
          orderBy: {
            versionNumber: Prisma.SortOrder.desc
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
        originId: entity.id,
        action: action,
        originType: EnumPendingChangeOriginType.Entity,
        versionNumber: lastVersion.versionNumber + 1,
        origin: entity,
        resource: entity.resource
      };
    });
  }

  async getChangedEntitiesByCommit(commitId: string): Promise<PendingChange[]> {
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
        resource: true,
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
        originId: entity.id,
        action: action,
        originType: EnumPendingChangeOriginType.Entity,
        versionNumber: changedVersion.versionNumber,
        origin: entity,
        resource: entity.resource
      };
    });
  }

  async updateOneEntity(
    args: UpdateOneEntityArgs,
    user: User
  ): Promise<Entity | null> {
    /**@todo: add validation on updated fields. most fields cannot be updated once the entity was deployed */
    return await this.useLocking(args.where.id, user, async entity => {
      const newName =
        args.data.name?.toLowerCase().trim() ||
        entity?.name.toLowerCase().trim();

      const newPluralDisplayName =
        args.data.pluralDisplayName?.toLowerCase().trim() ||
        entity?.pluralDisplayName.toLowerCase().trim();

      if (newName === newPluralDisplayName) {
        throw new AmplicationError(
          `The entity name and plural display name cannot be the same.`
        );
      }

      if (isReservedName(args.data?.name?.toLowerCase().trim())) {
        throw new ReservedNameError(args.data?.name?.toLowerCase().trim());
      }

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
    args: Prisma.EntityFieldFindManyArgs
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
    args: Prisma.EntityFieldFindManyArgs
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

  /**
   * Checks if the entity has any meaningful changes (some generated properties are ignored : id, createdAt...)
   * between its current and last version.
   * Every list of records is sorted to get a consistent order and make versions comparable.
   * @param entityId The entity to check for changes
   * @returns whether the entity's current version has changes
   */
  async hasPendingChanges(entityId: string): Promise<boolean> {
    const entityVersions = await this.prisma.entityVersion.findMany({
      where: {
        entityId
      },
      orderBy: {
        versionNumber: Prisma.SortOrder.asc
      },
      include: {
        fields: {
          orderBy: {
            permanentId: Prisma.SortOrder.asc
          }
        },
        permissions: {
          orderBy: {
            action: Prisma.SortOrder.asc
          },
          include: {
            permissionFields: {
              orderBy: {
                fieldPermanentId: Prisma.SortOrder.asc
              },
              include: {
                permissionRoles: {
                  orderBy: {
                    resourceRoleId: Prisma.SortOrder.asc
                  }
                }
              }
            },
            permissionRoles: {
              orderBy: {
                resourceRoleId: Prisma.SortOrder.asc
              },
              include: {
                resourceRole: true
              }
            }
          }
        }
      }
    });

    // If there's only one version, lastVersion will be undefined
    const currentVersion = entityVersions.shift();
    const lastVersion = last(entityVersions);

    if (currentVersion.deleted && !lastVersion) {
      // The entity was created than deleted => there are no changes
      return false;
    }

    return this.diffService.areDifferent(
      currentVersion,
      lastVersion,
      NON_COMPARABLE_PROPERTIES
    );
  }

  /**
   * Has the responsibility to unlock or keep an entity locked based on whether
   * it has changes. It's supposed to be used after an operation that uses locking
   * was made.
   * @param entityId A locked entity
   */
  async updateLock(entityId: string): Promise<void> {
    const hasPendingChanges = await this.hasPendingChanges(entityId);

    if (!hasPendingChanges) {
      await this.releaseLock(entityId);
    }
  }

  /**
   * Higher order function responsible for encapsulating the locking behavior.
   * It will lock an entity, execute some provided operations on it then update the lock
   * (unlock it or keep it locked).
   * @param entityId The entity on which the locking and operations are performed
   * @param user The user requesting the operations
   * @param fn A function containing the operations on the entity
   * @returns What the provided function `fn` returns
   */
  async useLocking<T>(
    entityId: string,
    user: User,
    fn: (entity: Entity) => T
  ): Promise<T> {
    const entity = await this.acquireLock({ where: { id: entityId } }, user);

    try {
      return await fn(entity);
    } finally {
      await this.updateLock(entityId);
    }
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
      throw new AmplicationError(
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
        versionNumber: Prisma.SortOrder.asc
      }
    });

    const firstEntityVersion = head(entityVersions);
    const lastEntityVersion = last(entityVersions);
    if (!firstEntityVersion || !lastEntityVersion) {
      throw new AmplicationError(`Entity ${entityId} has no versions`);
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
        versionNumber: Prisma.SortOrder.asc
      },
      include: {
        entity: true
      }
    });

    const firstEntityVersion = head(entityVersions);
    const lastEntityVersion = last(entityVersions);

    if (!firstEntityVersion || !lastEntityVersion) {
      throw new AmplicationError(`Entity ${entityId} has no versions `);
    }

    if (firstEntityVersion.entity.lockedByUserId !== userId) {
      throw new AmplicationError(
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
    const sourceVersion = await this.prisma.entityVersion.findUnique({
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
      throw new AmplicationError(
        `Can't find source (Entity Version ${sourceVersionId})`
      );
    }

    let targetVersion = await this.prisma.entityVersion.findUnique({
      where: {
        id: targetVersionId
      }
    });

    if (!targetVersion) {
      throw new AmplicationError(
        `Can't find target (Entity Version ${targetVersionId})`
      );
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
    const createPermissionsData: Prisma.EntityPermissionCreateNestedManyWithoutEntityVersionInput = {
      create: sourceVersion.permissions.map(permission => {
        return {
          action: permission.action,
          type: permission.type,
          permissionRoles: {
            create: permission.permissionRoles.map(permissionRole => {
              return {
                resourceRole: {
                  connect: {
                    id: permissionRole.resourceRoleId
                  }
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

    await Promise.all(
      sourceVersion.permissions.map(permission => {
        return this.prisma.entityPermission.update({
          where: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            entityVersionId_action: {
              action: permission.action,
              entityVersionId: targetVersionId
            }
          },
          data: {
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
                        entityVersionId_action_resourceRoleId: {
                          action: fieldRole.action,
                          entityVersionId: targetVersionId,
                          resourceRoleId: fieldRole.resourceRoleId
                        }
                      };
                    })
                  }
                };
              })
            }
          }
        });
      })
    );

    return targetVersion;
  }

  //The function must only be used from a @FieldResolver on Entity, otherwise it may return versions of a deleted entity
  async getVersions(args: FindManyEntityVersionArgs): Promise<EntityVersion[]> {
    return this.prisma.entityVersion.findMany(args);
  }

  async getLatestVersions(args: {
    where: Prisma.EntityWhereInput;
  }): Promise<EntityVersion[]> {
    const entities = await this.prisma.entity.findMany({
      where: {
        ...args.where,
        resourceId: args.where.resource.id,
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
            versionNumber: Prisma.SortOrder.desc
          }
        }
      }
    });

    return entities
      .filter(entity => entity.versions.length > 0)
      .map(entity => entity.versions[0]);
  }

  async getVersionCommit(entityVersionId: string): Promise<Commit> {
    const version = this.prisma.entityVersion.findUnique({
      where: {
        id: entityVersionId
      }
    });

    return version.commit();
  }

  /*validate that the selected entity ID exist in the current resource and it is a persistent entity */
  async isEntityInSameResource(
    entityId: string,
    resourceId: string
  ): Promise<boolean> {
    const entities = await this.prisma.entity.findMany({
      where: {
        id: entityId,
        resource: {
          id: resourceId
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
    return await this.useLocking(args.where.id, user, async () => {
      const entityVersion = await this.prisma.entityVersion.findUnique({
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
          // eslint-disable-next-line @typescript-eslint/naming-convention
          entityVersionId_action: {
            entityVersionId: entityVersionId,
            action: args.data.action
          }
        }
      });
    });
  }

  async updateEntityPermissionRoles(
    args: UpdateEntityPermissionRolesArgs,
    user: User
  ): Promise<EntityPermission> {
    return await this.useLocking(
      args.data.entity.connect.id,
      user,
      async () => {
        const entityVersion = await this.prisma.entityVersion.findUnique({
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
              resourceRole: {
                connect: {
                  id: role.id
                }
              }
            };
          });

          promises.push(
            this.prisma.entityPermission.update({
              where: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
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
                resourceRoleId: {
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
                resourceRole: true
              }
            },
            permissionFields: {
              include: {
                field: true,
                permissionRoles: {
                  include: {
                    resourceRole: true
                  }
                }
              }
            }
          },
          take: 1
        });

        return results[0];
      }
    );
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
        action: Prisma.SortOrder.asc
      },
      include: {
        permissionRoles: {
          orderBy: {
            resourceRoleId: Prisma.SortOrder.asc
          },
          include: {
            resourceRole: true
          }
        },
        permissionFields: {
          orderBy: {
            fieldPermanentId: Prisma.SortOrder.asc
          },
          include: {
            field: true,
            permissionRoles: {
              orderBy: {
                resourceRoleId: Prisma.SortOrder.asc
              },
              include: {
                resourceRole: true
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
    return await this.useLocking(
      args.data.entity.connect.id,
      user,
      async () => {
        const nonMatchingNames = await this.validateAllFieldsExist(
          args.data.entity.connect.id,
          [args.data.fieldName]
        );
        if (nonMatchingNames.size > 0) {
          throw new NotFoundException(
            `Invalid field selected: ${Array.from(nonMatchingNames).join(', ')}`
          );
        }

        const entityVersion = await this.prisma.entityVersion.findUnique({
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
    );
  }

  async deleteEntityPermissionField(
    args: DeleteEntityPermissionFieldArgs,
    user: User
  ): Promise<EntityPermissionField> {
    return await this.useLocking(args.where.entityId, user, async () => {
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
        throw new AmplicationError(`Record not found`);
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
    });
  }

  async updateEntityPermissionFieldRoles(
    args: UpdateEntityPermissionFieldRolesArgs,
    user: User
  ): Promise<EntityPermissionField> {
    const promises: Promise<any>[] = [];

    const field = await this.prisma.entityPermissionField.findUnique({
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

    return await this.useLocking(entityId, user, async () => {
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
        const deleteMany = args.data.deletePermissionRoles.map(
          permissionRole => {
            return {
              id: permissionRole.id
            };
          }
        );

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

      return this.prisma.entityPermissionField.findUnique({
        where: {
          id: args.data.permissionField.connect.id
        },
        include: {
          field: true,
          permissionRoles: {
            include: {
              resourceRole: true
            }
          }
        }
      });
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

    const createFieldArgs: CreateOneEntityFieldArgs = { data };

    // In case created data type is Lookup define related field names according
    // to the entity
    if (data.dataType === EnumDataType.Lookup) {
      const {
        allowMultipleSelection
      } = (data.properties as unknown) as types.Lookup;

      createFieldArgs.relatedFieldName = camelCase(
        !allowMultipleSelection ? entity.pluralDisplayName : entity.name
      );

      createFieldArgs.relatedFieldDisplayName = !allowMultipleSelection
        ? entity.pluralDisplayName
        : entity.displayName;
    }

    return this.createField(createFieldArgs, user);
  }

  /**
   * Created the field input with the relevant properties. When dataType is not provided, it will be guessed based on the field name
   * @param args
   * @param entity
   * @returns
   */
  async createFieldCreateInputByDisplayName(
    args: CreateOneEntityFieldByDisplayNameArgs,
    entity: Entity
  ): Promise<{ name: string; dataType: EnumDataType; properties: JsonObject }> {
    const { displayName } = args.data;
    const lowerCaseName = displayName.toLowerCase();
    const name = camelCase(displayName);

    let dataType: EnumDataType | null = null;

    if (args.data.dataType) {
      dataType = args.data.dataType as EnumDataType;
    } else if (lowerCaseName.includes('date')) {
      dataType = EnumDataType.DateTime;
    } else if (
      lowerCaseName.includes('description') ||
      lowerCaseName.includes('comments')
    ) {
      dataType = EnumDataType.MultiLineText;
    } else if (lowerCaseName.includes('email')) {
      dataType = EnumDataType.Email;
    } else if (lowerCaseName.includes('status')) {
      dataType = EnumDataType.OptionSet;
    } else if (lowerCaseName.startsWith('is')) {
      dataType = EnumDataType.Boolean;
    } else if (lowerCaseName.includes('price')) {
      dataType = EnumDataType.DecimalNumber;
    } else if (
      lowerCaseName.includes('quantity') ||
      lowerCaseName.includes('qty')
    ) {
      dataType = EnumDataType.WholeNumber;
    }

    if (dataType === EnumDataType.Lookup || dataType === null) {
      // Find an entity with the field's display name
      const relatedEntity = await this.findEntityByNames(
        name,
        entity.resourceId
      );
      // If found attempt to create a lookup field
      if (relatedEntity) {
        // The created field would be multiple selection if its name is equal to
        // the related entity's plural display name
        const allowMultipleSelection =
          relatedEntity.pluralDisplayName.toLowerCase() === lowerCaseName;

        // The related field allow multiple selection should be the opposite of
        // the field's
        const relatedFieldAllowMultipleSelection = !allowMultipleSelection;

        // The related field name should resemble the name of the field's entity
        const relatedFieldName = camelCase(
          relatedFieldAllowMultipleSelection
            ? entity.name
            : entity.pluralDisplayName
        );

        // If there are no existing fields with the desired name, instruct to create a lookup field
        if (
          await this.isFieldNameAvailable(relatedFieldName, relatedEntity.id)
        ) {
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
    }

    return {
      name,
      dataType: dataType || EnumDataType.SingleLineText,
      properties:
        DATA_TYPE_TO_DEFAULT_PROPERTIES[dataType || EnumDataType.SingleLineText]
    };
  }

  /**
   * Check whether a given field name is available in a give entity
   * @param entityId the entity ID to check name availability in
   * @param name the name to check availability for
   * @returns whether the field name is available in the given entity
   */
  private async isFieldNameAvailable(
    name: string,
    entityId: string
  ): Promise<boolean> {
    const existing = await this.getFields(entityId, { where: { name } });
    return isEmpty(existing);
  }

  /**
   * Find entity by its names (name, displayName and pluralDisplayName) in given resource
   * @param name the entity name query
   * @param resourceId the resource identifier to search entity for
   * @returns entity with a name matching the given name in the given resource
   */
  private findEntityByNames(name: string, resourceId: string): Promise<Entity> {
    return this.findFirst({
      where: createEntityNamesWhereInput(name, resourceId)
    });
  }

  validateFieldMutationArgs(
    args: CreateOneEntityFieldArgs | UpdateOneEntityFieldArgs,
    entity: Entity
  ): void {
    const { data, relatedFieldName, relatedFieldDisplayName } = args;
    if (data.dataType === EnumDataType.Lookup) {
      const { relatedFieldId } = (data.properties as unknown) as types.Lookup;
      if (
        !relatedFieldId &&
        (!relatedFieldName || !relatedFieldDisplayName) &&
        data.properties.relatedEntityId === entity.id
      ) {
        throw new DataConflictError(
          RELATED_FIELD_ID_UNDEFINED_AND_NAMES_UNDEFINED_ERROR_MESSAGE
        );
      }
      if (relatedFieldId && (relatedFieldName || relatedFieldDisplayName)) {
        throw new DataConflictError(
          RELATED_FIELD_ID_DEFINED_NAMES_SHOULD_BE_UNDEFINED_ERROR_MESSAGE
        );
      }
    } else {
      if (relatedFieldName || relatedFieldDisplayName) {
        throw new DataConflictError(
          RELATED_FIELD_NAMES_SHOULD_BE_UNDEFINED_ERROR_MESSAGE
        );
      }
    }
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

    // Validate the field's properties (if both are undefined skip the test)
    if (!(undefined === data.dataType && undefined === data.properties)) {
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
  }

  async createField(
    args: CreateOneEntityFieldArgs,
    user: User
  ): Promise<EntityField> {
    if (isReservedName(args.data?.name?.toLowerCase().trim())) {
      throw new ReservedNameError(args.data?.name?.toLowerCase().trim());
    }

    // Omit entity from received data
    const data = omit(args.data, ['entity']);

    return await this.useLocking(
      args.data.entity.connect.id,
      user,
      async entity => {
        // Validate args
        this.validateFieldMutationArgs(args, entity);

        if (args.data.dataType === EnumDataType.Lookup) {
          // If field data type is Lookup add relatedFieldId to field properties
          args.data.properties.relatedFieldId = cuid();
        }

        // Validate data
        await this.validateFieldData(data, entity);

        // Create field ID ahead of time so it can be used in the related field creation
        const fieldId = cuid();

        if (args.data.dataType === EnumDataType.Lookup) {
          // Cast the received properties to Lookup properties type
          const properties = (args.data.properties as unknown) as types.Lookup;

          // Create a related lookup field in the related entity
          await this.createRelatedField(
            properties.relatedFieldId,
            args.relatedFieldName,
            args.relatedFieldDisplayName,
            !properties.allowMultipleSelection,
            properties.relatedEntityId,
            entity.id,
            fieldId,
            user
          );
        }

        // Create entity field
        return this.prisma.entityField.create({
          data: {
            ...data,
            permanentId: fieldId,
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
    );
  }

  /** 2021-02-10
   * This method is used to fix previous versions of lookup fields
   * that are missing the property.relatedEntityField value The function will
   * throw an exception if the provided field already have a related entity
   * field, or it is a field of a different type other the Lookup
   */
  async createDefaultRelatedField(
    args: CreateDefaultRelatedFieldArgs,
    user: User
  ): Promise<EntityField> {
    // Get field to update
    const field = await this.getField({
      where: args.where,
      include: { entityVersion: true }
    });

    if (field.dataType != EnumDataType.Lookup) {
      throw new ConflictException(
        `Cannot created default related field, because the provided field is not of a relation field`
      );
    }

    if (
      !isEmpty(((field.properties as unknown) as types.Lookup).relatedFieldId)
    ) {
      throw new ConflictException(
        `Cannot created default related field, because the provided field is already related to another field`
      );
    }

    return await this.useLocking(
      field.entityVersion.entityId,
      user,
      async entity => {
        // Validate args
        this.validateFieldMutationArgs(
          {
            ...args,
            data: {
              properties: field.properties as JsonObject,
              dataType: field.dataType
            }
          },
          entity
        );

        const relatedFieldId = cuid();

        // Cast the received properties as Lookup properties
        const properties = (field.properties as unknown) as types.Lookup;

        //create the related field
        await this.createRelatedField(
          relatedFieldId,
          args.relatedFieldName,
          args.relatedFieldDisplayName,
          !properties.allowMultipleSelection,
          properties.relatedEntityId,
          entity.id,
          field.permanentId,
          user
        );

        properties.relatedFieldId = relatedFieldId;

        //Update the field with the ID of the related field
        return this.prisma.entityField.update({
          where: {
            id: field.id
          },
          data: {
            properties: (properties as unknown) as Prisma.InputJsonValue
          }
        });
      }
    );
  }

  private async createRelatedField(
    id: string,
    name: string,
    displayName: string,
    allowMultipleSelection: boolean,
    entityId: string,
    relatedEntityId: string,
    relatedFieldId: string,
    user: User
  ): Promise<EntityField> {
    return await this.useLocking(entityId, user, async () => {
      return this.prisma.entityField.create({
        data: {
          ...BASE_FIELD,
          name,
          displayName,
          dataType: EnumDataType.Lookup,
          permanentId: id,
          entityVersion: {
            connect: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              entityId_versionNumber: {
                entityId,
                versionNumber: CURRENT_VERSION_NUMBER
              }
            }
          },
          properties: {
            allowMultipleSelection,
            relatedEntityId,
            relatedFieldId
          }
        }
      });
    });
  }

  private async deleteRelatedField(
    permanentId: string,
    entityId: string,
    user: User
  ): Promise<void> {
    await this.useLocking(entityId, user, async () => {
      // Get field to delete
      const field = await this.getField({
        where: {
          permanentId
        }
      });

      // Delete the related field from the database
      await this.prisma.entityField.delete({
        where: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          entityVersionId_permanentId: {
            permanentId,
            entityVersionId: field.entityVersionId
          }
        }
      });
    });
  }

  async updateField(
    args: UpdateOneEntityFieldArgs,
    user: User
  ): Promise<EntityField> {
    if (isReservedName(args.data?.name?.toLowerCase().trim())) {
      throw new ReservedNameError(args.data?.name?.toLowerCase().trim());
    }
    // Get field to update
    const field = await this.getField({
      where: args.where,
      include: { entityVersion: true }
    });

    if (isSystemDataType(field.dataType as EnumDataType)) {
      throw new ConflictException(
        `Cannot update entity field ${field.name} because fields with data type ${field.dataType} cannot be updated`
      );
    }

    // Delete related field in case field data type is changed from lookup
    const shouldDeleteRelated =
      field.dataType === EnumDataType.Lookup &&
      args.data.dataType !== EnumDataType.Lookup;

    // Create related field in case field data type is changed to lookup
    const shouldCreateRelated =
      args.data.dataType === EnumDataType.Lookup &&
      field.dataType !== EnumDataType.Lookup;

    // Change related field in case related entity ID is changed
    const shouldChangeRelated =
      !shouldCreateRelated &&
      !shouldDeleteRelated &&
      args.data.properties?.relatedEntityId !==
        ((field.properties as unknown) as types.Lookup)?.relatedEntityId;

    return await this.useLocking(
      field.entityVersion.entityId,
      user,
      async entity => {
        // Validate args
        this.validateFieldMutationArgs(args, entity);

        // In case related field should be created or changed, assign properties a
        // new related field ID
        if (shouldCreateRelated || shouldChangeRelated) {
          args.data.properties.relatedFieldId = cuid();
        }

        // Validate data
        await this.validateFieldData(args.data, entity);

        /**
         * @todo validate the field was not published - only specific properties of
         * fields that were already published can be updated
         */

        // In case related field should be deleted or changed, delete the existing related field
        if (shouldDeleteRelated || shouldChangeRelated) {
          const properties = (field.properties as unknown) as types.Lookup;

          /**@todo: when the field should be changed and we delete it, we loose the permanent ID and links to previous versions  */
          await this.deleteRelatedField(
            properties.relatedFieldId,
            properties.relatedEntityId,
            user
          );
        }

        // In case related field should be created or changed, create a new related field
        if (shouldCreateRelated || shouldChangeRelated) {
          // Cast the received properties as Lookup properties
          const properties = (args.data.properties as unknown) as types.Lookup;

          await this.createRelatedField(
            properties.relatedFieldId,
            args.relatedFieldName,
            args.relatedFieldDisplayName,
            !properties.allowMultipleSelection,
            properties.relatedEntityId,
            entity.id,
            field.permanentId,
            user
          );
        }

        return this.prisma.entityField.update(
          omit(args, ['relatedFieldName', 'relatedFieldDisplayName'])
        );
      }
    );
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

    return await this.useLocking(
      field.entityVersion.entityId,
      user,
      async () => {
        if (field.dataType === EnumDataType.Lookup) {
          // Cast the field properties as Lookup properties
          const properties = (field.properties as unknown) as types.Lookup;
          try {
            await this.deleteRelatedField(
              properties.relatedFieldId,
              properties.relatedEntityId,
              user
            );
          } catch (error) {
            //continue to delete the field even if the deletion of the related field failed.
            //This is done in order to allow the user to workaround issues in any case when a related field is missing
            console.log(
              'Continue with FieldDelete even though the related field could not be deleted or was not found ',
              error
            );
          }
        }

        return this.prisma.entityField.delete(args);
      }
    );
  }

  /**
   * Gets a field according to provided arguments.
   * @param args arguments to find field according to
   * @returns the entity field
   * @throws {NotFoundException} thrown if the field is not found or it relates
   * to a past entity version
   */
  private async getField(
    args: Prisma.EntityFieldFindFirstArgs
  ): Promise<EntityField> {
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
        `Could not find an entity field for: ${JSON.stringify(args.where)}`
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

export function createEntityNamesWhereInput(
  name: string,
  resourceId: string
): Prisma.EntityWhereInput {
  return {
    resourceId: resourceId,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    OR: [
      {
        displayName: {
          equals: name,
          mode: Prisma.QueryMode.insensitive
        }
      },
      {
        pluralDisplayName: {
          equals: name,
          mode: Prisma.QueryMode.insensitive
        }
      },
      {
        name: {
          equals: name,
          mode: Prisma.QueryMode.insensitive
        }
      }
    ]
  };
}
