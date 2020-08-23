import { Injectable, NotFoundException } from '@nestjs/common';
import { SortOrder } from '@prisma/client';
import head from 'lodash.head';
import last from 'lodash.last';
import omit from 'lodash.omit';
import difference from '@extra-set/difference';
import {
  Entity,
  EntityField,
  EntityVersion,
  Commit,
  User,
  EntityPermission,
  EntityPermissionRole,
  EntityPermissionField
} from 'src/models';
import { PrismaService } from 'src/services/prisma.service';

import {
  CreateOneEntityArgs,
  FindManyEntityArgs,
  FindOneEntityArgs,
  UpdateOneEntityArgs,
  CreateOneEntityVersionArgs,
  FindManyEntityVersionArgs,
  DeleteOneEntityArgs,
  UpdateEntityPermissionArgs,
  LockEntityArgs,
  FindManyEntityFieldArgs,
  EntityWhereInput,
  EntityVersionWhereInput,
  AddEntityPermissionRoleArgs,
  AddEntityPermissionFieldArgs,
  DeleteEntityPermissionRoleArgs,
  DeleteEntityPermissionFieldArgs
} from './dto';
import { CURRENT_VERSION_NUMBER } from '../entityField/constants';
import { isEmpty } from 'lodash';

@Injectable()
export class EntityService {
  constructor(private readonly prisma: PrismaService) {}

  async entity(args: FindOneEntityArgs): Promise<Entity | null> {
    const entity: Entity = await this.prisma.entity.findOne({
      where: {
        id: args.where.id
      }
    });

    return entity;
  }

  async entities(args: FindManyEntityArgs): Promise<Entity[]> {
    return this.prisma.entity.findMany(args);
  }

  async getEntitiesByVersions(args: {
    where: Omit<EntityVersionWhereInput, 'entity'>;
    include?: { fields?: boolean };
  }): Promise<Entity[]> {
    const entityVersions = await this.prisma.entityVersion.findMany({
      ...args,
      include: {
        entityFields: args?.include.fields,
        entity: true
      }
    });

    return entityVersions.map(({ entity, entityFields }) => {
      return {
        ...entity,
        fields: entityFields
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
        }
      }
    });

    // Creates first entry on EntityVersion by default when new entity is created
    await this.prisma.entityVersion.create({
      data: {
        commit: undefined,
        versionNumber: 0,
        entity: {
          connect: {
            id: newEntity.id
          }
        }
      }
    });
    return newEntity;
  }

  async deleteOneEntity(
    args: DeleteOneEntityArgs,
    user: User
  ): Promise<Entity | null> {
    await this.acquireLock(args, user);

    /**@todo: change to soft delete   */
    return this.prisma.entity.delete(args);
  }

  async updateOneEntity(
    args: UpdateOneEntityArgs,
    user: User
  ): Promise<Entity | null> {
    /**@todo: add validation on updated fields. most fields cannot be updated once the entity was deployed */

    await this.acquireLock(args, user);
    return this.prisma.entity.update(args);
  }

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

  async getEntityVersion(
    entityId: string,
    versionNumber: number
  ): Promise<EntityVersion> {
    let entityVersions;
    if (versionNumber) {
      entityVersions = await this.prisma.entityVersion.findMany({
        where: {
          entity: { id: entityId },
          versionNumber: versionNumber
        }
      });
    } else {
      entityVersions = await this.prisma.entityVersion.findMany({
        where: {
          entity: { id: entityId }
        },
        orderBy: { versionNumber: SortOrder.asc }
      });
    }
    return (
      (entityVersions && entityVersions.length && entityVersions[0]) || null
    );
  }

  async acquireLock(args: LockEntityArgs, user: User): Promise<Entity | null> {
    const entityId = args.where.id;

    const entity = await this.prisma.entity.findOne({
      where: {
        id: entityId
      }
    });

    if (!entity) {
      throw new Error(`Can't find Entity ${entityId} `);
    }

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
      }
    });
    const firstEntityVersion = head(entityVersions);
    const lastEntityVersion = last(entityVersions);
    if (!firstEntityVersion || !lastEntityVersion) {
      throw new Error(`Entity ${entityId} has no versions`);
    }
    const lastVersionNumber = lastEntityVersion.versionNumber;

    // Get entity fields from it's current version
    const firstEntityVersionFields = await this.prisma.entityField.findMany({
      where: {
        entityVersion: { id: firstEntityVersion.id }
      }
    });

    // Duplicate the fields of the current version, omitting entityVersionId and
    // id properties.
    const duplicatedFields = firstEntityVersionFields.map(field =>
      omit(field, ['entityVersionId', 'id'])
    );

    const nextVersionNumber = lastVersionNumber + 1;

    const newEntityVersion = this.prisma.entityVersion.create({
      data: {
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
        },
        entityFields: {
          create: duplicatedFields
        }
      }
    });

    return newEntityVersion;
  }

  async getVersions(args: FindManyEntityVersionArgs): Promise<EntityVersion[]> {
    return this.prisma.entityVersion.findMany(args);
  }

  async getLatestVersions(args: {
    where: EntityWhereInput;
  }): Promise<EntityVersion[]> {
    const entities = await this.prisma.entity.findMany({
      where: args.where,
      include: {
        entityVersions: true
      }
    });
    return entities.flatMap(entity => entity.entityVersions);
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
  async isPersistentEntityInSameApp(
    entityId: string,
    appId: string
  ): Promise<boolean> {
    const entities = await this.prisma.entity.findMany({
      where: {
        id: entityId,
        app: {
          id: appId
        },
        isPersistent: true
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
    args: UpdateEntityPermissionArgs
  ): Promise<EntityPermission> {
    const entityVersion = await this.prisma.entityVersion.findOne({
      where: {
        // eslint-disable-next-line @typescript-eslint/camelcase
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
        // eslint-disable-next-line @typescript-eslint/camelcase
        entityVersionId_action: {
          entityVersionId: entityVersionId,
          action: args.data.action
        }
      }
    });
  }

  async addEntityPermissionRole(
    args: AddEntityPermissionRoleArgs
  ): Promise<EntityPermissionRole> {
    const entityVersion = await this.prisma.entityVersion.findOne({
      where: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        entityId_versionNumber: {
          entityId: args.data.entity.connect.id,
          versionNumber: CURRENT_VERSION_NUMBER
        }
      }
    });
    const entityVersionId = entityVersion.id;

    return this.prisma.entityPermissionRole.create({
      data: {
        appRole: args.data.appRole,
        entityPermission: {
          connect: {
            // eslint-disable-next-line @typescript-eslint/camelcase
            entityVersionId_action: {
              entityVersionId: entityVersionId,
              action: args.data.action
            }
          }
        }
      }
    });
  }

  async deleteEntityPermissionRole(
    args: DeleteEntityPermissionRoleArgs
  ): Promise<EntityPermissionRole> {
    const permissionRole = await this.prisma.entityPermissionRole.findMany({
      where: {
        entityPermission: {
          entityVersion: {
            entityId: args.where.entityId,
            versionNumber: CURRENT_VERSION_NUMBER
          },
          action: args.where.action
        },
        appRoleId: args.where.appRoleId
      }
    });

    if (isEmpty(permissionRole)) {
      throw new Error(`Record not found`);
    }

    const id = permissionRole[0].id;

    return this.prisma.entityPermissionRole.delete({
      where: {
        id: id
      }
    });
  }

  async getPermissions(entityId: string): Promise<EntityPermission[]> {
    return await this.prisma.entityPermission.findMany({
      where: {
        entityVersion: {
          entityId: entityId,
          versionNumber: CURRENT_VERSION_NUMBER
        }
      },
      include: {
        roles: {
          include: {
            appRole: true
          }
        },
        fields: {
          include: {
            field: true
          }
        }
      }
    });
  }

  async addEntityPermissionField(
    args: AddEntityPermissionFieldArgs
  ): Promise<EntityPermissionField> {
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
        // eslint-disable-next-line @typescript-eslint/camelcase
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
            // eslint-disable-next-line @typescript-eslint/camelcase
            entityVersionId_name: {
              entityVersionId: entityVersionId,
              name: args.data.fieldName
            }
          }
        },
        entityPermission: {
          connect: {
            // eslint-disable-next-line @typescript-eslint/camelcase
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
    args: DeleteEntityPermissionFieldArgs
  ): Promise<EntityPermissionField> {
    const permissionField = await this.prisma.entityPermissionField.findMany({
      where: {
        entityPermission: {
          entityVersion: {
            entityId: args.where.entityId,
            versionNumber: CURRENT_VERSION_NUMBER
          },
          action: args.where.action
        },
        field: {
          name: args.where.fieldName
        }
      }
    });

    if (isEmpty(permissionField)) {
      throw new Error(`Record not found`);
    }

    const id = permissionField[0].id;

    return this.prisma.entityPermissionField.delete({
      where: {
        id: id
      }
    });
  }
}
