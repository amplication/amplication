import {
  Injectable,
  NotFoundException,
  ConflictException
} from '@nestjs/common';
import { SortOrder, EntityFieldDeleteArgs } from '@prisma/client';
import head from 'lodash.head';
import last from 'lodash.last';
import omit from 'lodash.omit';
import difference from '@extra-set/difference';
import { isEmpty } from 'lodash';
import {
  Entity,
  EntityField,
  EntityVersion,
  Commit,
  User,
  EntityPermission,
  EntityPermissionField
} from 'src/models';
import { JsonValue } from 'type-fest';
import { PrismaService } from 'src/services/prisma.service';
import { JsonSchemaValidationService } from 'src/services/jsonSchemaValidation.service';
import { EnumDataType } from 'src/enums/EnumDataType';
import { SchemaValidationResult } from 'src/dto/schemaValidationResult';
import { EntityFieldPropertiesValidationSchemaFactory as schemaFactory } from './entityFieldPropertiesValidationSchemaFactory';
import { CURRENT_VERSION_NUMBER, INITIAL_ENTITY_FIELDS } from './constants';

import {
  CreateOneEntityFieldArgs,
  UpdateOneEntityFieldArgs,
  EntityFieldCreateInput,
  EntityFieldUpdateInput,
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
  UpdateEntityPermissionRolesArgs,
  UpdateEntityPermissionFieldRolesArgs,
  AddEntityPermissionFieldArgs,
  DeleteEntityPermissionFieldArgs
} from './dto';
import { EnumEntityAction } from 'src/enums/EnumEntityAction';

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

  async getEntitiesByVersions(args: {
    where: Omit<EntityVersionWhereInput, 'entity'>;
    include?: { fields?: boolean };
  }): Promise<Entity[]> {
    const entityVersions = await this.prisma.entityVersion.findMany({
      where: {
        ...args.where,
        deleted: null
      },
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
        },
        entityVersions: {
          create: {
            commit: undefined,
            versionNumber: CURRENT_VERSION_NUMBER
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
            // eslint-disable-next-line @typescript-eslint/camelcase, @typescript-eslint/naming-convention
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
            // eslint-disable-next-line @typescript-eslint/camelcase, @typescript-eslint/naming-convention
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
            // eslint-disable-next-line @typescript-eslint/camelcase, @typescript-eslint/naming-convention
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

  async deleteOneEntity(
    args: DeleteOneEntityArgs,
    user: User
  ): Promise<Entity | null> {
    await this.acquireLock(args, user);

    return this.prisma.entity.update({
      where: args.where,
      data: {
        deletedAt: new Date(),
        entityVersions: {
          update: {
            where: {
              // eslint-disable-next-line @typescript-eslint/camelcase, @typescript-eslint/naming-convention
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

  async updateOneEntity(
    args: UpdateOneEntityArgs,
    user: User
  ): Promise<Entity | null> {
    /**@todo: add validation on updated fields. most fields cannot be updated once the entity was deployed */

    await this.acquireLock(args, user);
    return this.prisma.entity.update(args);
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
        isPersistent: true,
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
        // eslint-disable-next-line @typescript-eslint/camelcase, @typescript-eslint/naming-convention
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
            permissionFieldRoles: {
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
    return this.prisma.entityPermission.findMany({
      where: {
        entityVersion: {
          entityId: entityId,
          versionNumber: CURRENT_VERSION_NUMBER,
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
            permissionFieldRoles: {
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
        entityPermission: {
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
        entityPermission: {
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

    const { entityId, versionNumber } = field.entityPermission.entityVersion;

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
            permissionFieldRoles: {
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
            permissionFieldRoles: {
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
        permissionFieldRoles: {
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
      const schema = schemaFactory.getSchema(dataType);
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

    // Validate entity field data
    await this.validateFieldData(data);

    await this.acquireLock({ where: { id: entity.connect.id } }, user);

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

    // Validate entity field data
    await this.validateFieldData(args.data);

    /**
     * @todo validate the field was not published - only specific properties of
     * fields that were already published can be updated
     */

    await this.acquireLock(
      { where: { id: entityField.entityVersion.entityId } },
      user
    );

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
