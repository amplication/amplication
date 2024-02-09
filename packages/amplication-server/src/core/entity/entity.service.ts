/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-use-before-define */

import cuid from "cuid";
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
  Inject,
} from "@nestjs/common";
import { DataConflictError } from "../../errors/DataConflictError";
import { Prisma, PrismaService } from "../../prisma";
import { AmplicationError } from "../../errors/AmplicationError";
import { camelCase } from "camel-case";
import { isEmpty, pick, last, head, omit, isEqual } from "lodash";
import {
  Entity,
  EntityField,
  EntityVersion,
  Commit,
  User,
  EntityPermission,
  EntityPermissionField,
  Resource,
} from "../../models";
import type { JsonObject } from "type-fest";
import { getSchemaForDataType, types } from "@amplication/code-gen-types";
import { JsonSchemaValidationService } from "../../services/jsonSchemaValidation.service";
import { DiffService } from "../../services/diff.service";
import { SchemaValidationResult } from "../../dto/schemaValidationResult";
import { EnumDataType } from "../../enums/EnumDataType";
import { EnumEntityAction } from "../../enums/EnumEntityAction";
import { isReservedName } from "./reservedNames";
import {
  CURRENT_VERSION_NUMBER,
  INITIAL_ENTITY_FIELDS,
  USER_ENTITY_NAME,
  DEFAULT_ENTITIES,
  DEFAULT_PERMISSIONS,
  SYSTEM_DATA_TYPES,
  DATA_TYPE_TO_DEFAULT_PROPERTIES,
  INITIAL_ID_TYPE_FIELDS,
} from "./constants";
import {
  prepareDeletedItemName,
  revertDeletedItemName,
} from "../../util/softDelete";

import {
  EnumPendingChangeOriginType,
  EnumPendingChangeAction,
  PendingChange,
} from "../resource/dto";

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
  UpdateEntityPermissionRolesArgs,
  UpdateEntityPermissionFieldRolesArgs,
  AddEntityPermissionFieldArgs,
  DeleteEntityPermissionFieldArgs,
  EntityCreateInput,
} from "./dto";
import { ReservedNameError } from "../resource/ReservedNameError";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { EnumEventType } from "../../services/segmentAnalytics/segmentAnalytics.types";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import { PrismaSchemaParserService } from "../prismaSchemaParser/prismaSchemaParser.service";
import { EnumActionLogLevel, EnumActionStepStatus } from "../action/dto";
import { BillingService } from "../billing/billing.service";
import { BillingFeature } from "@amplication/util-billing-types";
import { ActionContext } from "../userAction/types";
import { ServiceSettingsService } from "../serviceSettings/serviceSettings.service";
import { ModuleService } from "../module/module.service";
import { DefaultModuleForEntityNotFoundError } from "../module/DefaultModuleForEntityNotFoundError";
import { ModuleActionService } from "../moduleAction/moduleAction.service";
import { BillingLimitationError } from "../../errors/BillingLimitationError";
import { pascalCase } from "pascal-case";
import { EnumResourceType } from "../resource/dto/EnumResourceType";
import { EnumRelatedFieldStrategy } from "./dto/EnumRelatedFieldStrategy";

type EntityInclude = Omit<
  Prisma.EntityVersionInclude,
  "entityFields" | "entityPermissions" | "entity"
> & {
  fields?: boolean;
  permissions?: boolean | Prisma.EntityPermissionFindManyArgs;
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

export type CreateBulkEntitiesAndFieldsArgs = {
  resourceId: string;
  user: User;
  preparedEntitiesWithFields: CreateBulkEntitiesInput[];
};

export type CreateBulkEntitiesInput = Omit<EntityCreateInput, "resource"> & {
  fields: CreateBulkFieldsInput[];
};

export type CreateBulkFieldsInput = Omit<
  EntityFieldCreateInput,
  "entity" | "properties"
> & {
  properties: JsonObject;
  permanentId: string;
  relatedFieldName?: string;
  relatedFieldDisplayName?: string;
  relatedFieldAllowMultipleSelection?: boolean;
};

/**
 * Expect format for entity field name, matches the format of JavaScript variable name
 */
const NAME_REGEX = /^(?![0-9])[a-zA-Z0-9$_]+$/;
export const NAME_VALIDATION_ERROR_MESSAGE =
  "Name must only contain letters, numbers, the dollar sign, or the underscore character and must not start with a number";

export const NUMBER_WITH_INVALID_MINIMUM_VALUE =
  "Minimum value can not be greater than or equal to, the Maximum value";

export const DELETE_ONE_USER_ENTITY_ERROR_MESSAGE = `The 'user' entity is a reserved entity and it cannot be deleted`;

const RELATED_FIELD_ID_DEFINED_NAMES_SHOULD_BE_UNDEFINED_ERROR_MESSAGE =
  "When data.dataType is Lookup and data.properties.relatedFieldId is defined, relatedFieldName and relatedFieldDisplayName must be null";

const RELATED_FIELD_ID_UNDEFINED_AND_NAMES_UNDEFINED_ERROR_MESSAGE =
  "When data.dataType is Lookup, either data.properties.relatedFieldId must be defined or relatedFieldName and relatedFieldDisplayName must not be null and not be empty";

const RELATED_FIELD_NAMES_SHOULD_BE_UNDEFINED_ERROR_MESSAGE =
  "When data.dataType is not Lookup, relatedFieldName and relatedFieldDisplayName must be null";

const NAME = "name";
const DATA_TYPE = "dataType";
const SEARCHABLE = "searchable";

const BASE_FIELD: Pick<
  EntityField,
  "required" | "searchable" | "description" | "unique"
> = {
  required: false,
  unique: false,
  searchable: true,
  description: "",
};

const NON_COMPARABLE_PROPERTIES = [
  "id",
  "createdAt",
  "updatedAt",
  "versionNumber",
  "commitId",
  "permissionId",
  "entityVersionId",
  "resourceRoleId",
];

@Injectable()
export class EntityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jsonSchemaValidationService: JsonSchemaValidationService,
    private readonly diffService: DiffService,
    private readonly analytics: SegmentAnalyticsService,
    private readonly billingService: BillingService,
    private readonly prismaSchemaParserService: PrismaSchemaParserService,
    private readonly serviceSettingsService: ServiceSettingsService,
    private readonly moduleService: ModuleService,
    private readonly moduleActionService: ModuleActionService,
    @Inject(AmplicationLogger) private readonly logger: AmplicationLogger
  ) {}

  async entity(args: FindOneEntityArgs): Promise<Entity | null> {
    const entity = await this.prisma.entity.findFirst({
      where: {
        id: args.where.id,
        deletedAt: null,
      },
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
        deletedAt: null,
      },
    });
  }

  async findFirst(args: Prisma.EntityFindManyArgs): Promise<Entity | null> {
    const [first] = await this.entities({ ...args, take: 1 });
    return first || null;
  }

  async getEntitiesByVersions(args: {
    where: Omit<Prisma.EntityVersionWhereInput, "entity">;
    include?: EntityInclude;
  }): Promise<Entity[]> {
    const { fields, permissions, ...rest } = args.include;
    const entityVersions = await this.prisma.entityVersion.findMany({
      where: {
        ...args.where,
        deleted: null,
      },
      include: {
        ...rest,
        entity: true,
        fields: fields,
        permissions: permissions,
      },
    });

    return entityVersions.map(({ entity, fields, permissions }) => {
      return {
        ...entity,
        fields: this.addDBNumericTypesIfMissing(fields),
        permissions: permissions,
      };
    });
  }

  async checkServiceLicense(resource: Resource) {
    if (!this.billingService.isBillingEnabled) {
      return;
    }

    if (
      !resource.project?.licensed ||
      (!resource.licensed && resource.resourceType === EnumResourceType.Service)
    ) {
      const message = "Your workspace reached its service limitation.";
      throw new BillingLimitationError(message, BillingFeature.Services);
    }
  }

  async createOneEntity(
    args: CreateOneEntityArgs,
    user: User,
    createInitialEntityFields = true,
    enforceValidation = true,
    trackEvent = true
  ): Promise<Entity> {
    const resourceId = args.data.resource.connect.id;
    const resource = await this.prisma.resource.findUnique({
      where: { id: resourceId },
      include: { project: true },
    });

    await this.checkServiceLicense(resource);

    if (
      args.data?.name?.toLowerCase().trim() ===
      args.data?.pluralDisplayName?.toLowerCase().trim()
    ) {
      throw new AmplicationError(
        `The entity name and plural display name cannot be the same.`
      );
    }
    if (
      enforceValidation &&
      isReservedName(args.data?.name?.toLowerCase().trim())
    ) {
      throw new ReservedNameError(args.data?.name?.toLowerCase().trim());
    }

    const newEntity = await this.prisma.entity.create({
      data: {
        ...args.data,
        lockedAt: new Date(),
        lockedByUser: {
          connect: {
            id: user.id,
          },
        },
        versions: {
          create: {
            commit: undefined,
            versionNumber: CURRENT_VERSION_NUMBER,
            name: args.data.name,
            displayName: args.data.displayName,
            pluralDisplayName: args.data.pluralDisplayName,
            customAttributes: args.data.customAttributes,
            description: args.data.description,
            permissions: {
              create: DEFAULT_PERMISSIONS,
            },

            /**@todo: check how to use bulk insert while controlling the order of the insert (createdAt must be ordered correctly) */
            // entityFields: {
            //   create: INITIAL_ENTITY_FIELDS
            // }
          },
        },
      },
    });

    if (createInitialEntityFields) {
      await this.prisma.entityField.create({
        data: {
          ...INITIAL_ENTITY_FIELDS[0],
          entityVersion: {
            connect: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              entityId_versionNumber: {
                entityId: newEntity.id,
                versionNumber: CURRENT_VERSION_NUMBER,
              },
            },
          },
        },
      });
      await this.prisma.entityField.create({
        data: {
          ...INITIAL_ENTITY_FIELDS[1],
          entityVersion: {
            connect: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              entityId_versionNumber: {
                entityId: newEntity.id,
                versionNumber: CURRENT_VERSION_NUMBER,
              },
            },
          },
        },
      });
      await this.prisma.entityField.create({
        data: {
          ...INITIAL_ENTITY_FIELDS[2],
          entityVersion: {
            connect: {
              // eslint-disable-next-line @typescript-eslint/naming-convention
              entityId_versionNumber: {
                entityId: newEntity.id,
                versionNumber: CURRENT_VERSION_NUMBER,
              },
            },
          },
        },
      });
    }

    await this.moduleService.createDefaultModuleForEntity(
      {
        data: {
          name: args.data.name,
          displayName: args.data.name,
          resource: {
            connect: {
              id: resourceId,
            },
          },
        },
      },
      newEntity,
      user
    );

    if (trackEvent) {
      const resourceWithProject = await this.prisma.resource.findUnique({
        where: {
          id: resourceId,
        },
        include: {
          project: true,
        },
      });

      await this.analytics.track({
        userId: user.account.id,
        properties: {
          resourceId: resourceId,
          projectId: resourceWithProject.projectId,
          workspaceId: resourceWithProject.project.workspaceId,
          entityName: args.data.displayName,
          $groups: { groupWorkspace: resourceWithProject.project.workspaceId },
        },
        event: EnumEventType.EntityCreate,
      });
    }

    return newEntity;
  }

  async createEntitiesFromPrismaSchema(
    actionContext: ActionContext,
    file: string,
    fileName: string,
    resourceId: string,
    user: User
  ): Promise<Entity[]> {
    const { onEmitUserActionLog } = actionContext;

    const resourceWithProject = await this.prisma.resource.findUnique({
      where: {
        id: resourceId,
      },
      include: {
        project: true,
      },
    });

    const importDBSchema = await this.billingService.getBooleanEntitlement(
      resourceWithProject.project.workspaceId,
      BillingFeature.ImportDBSchema
    );

    this.logger.debug(
      `importDBSchemaEntitlement: ${importDBSchema?.hasAccess}`
    );

    if (importDBSchema && !importDBSchema.hasAccess)
      throw new AmplicationError(
        "Feature Unavailable. Your current user permissions doesn't include importing Prisma schemas"
      );

    await this.analytics.track({
      userId: user.account.id,
      properties: {
        resourceId: resourceId,
        projectId: resourceWithProject.projectId,
        workspaceId: resourceWithProject.project.workspaceId,
        fileName: fileName,
        $groups: { groupWorkspace: resourceWithProject.project.workspaceId },
      },
      event: EnumEventType.ImportPrismaSchemaStart,
    });

    try {
      const existingEntities = await this.prisma.entity.findMany({
        where: {
          resourceId: resourceId,
        },
        select: {
          name: true,
        },
      });

      //Step 1: Convert Prisma schema to import objects
      const preparedEntitiesWithFields =
        await this.prismaSchemaParserService.convertPrismaSchemaForImportObjects(
          file,
          existingEntities,
          actionContext
        );

      //Step 2: Validate entities and fields
      const valid = await this.validateBeforeCreateBulkEntitiesAndFields(
        preparedEntitiesWithFields,
        resourceId,
        actionContext
      );

      if (!valid) {
        await this.analytics.track({
          userId: user.account.id,
          properties: {
            resourceId: resourceId,
            projectId: resourceWithProject.projectId,
            workspaceId: resourceWithProject.project.workspaceId,
            fileName: fileName,
            error: "Duplicate entity names",
            $groups: {
              groupWorkspace: resourceWithProject.project.workspaceId,
            },
          },
          event: EnumEventType.ImportPrismaSchemaError,
        });

        this.logger.error(`Invalid Prisma schema`, null, {
          resourceId,
          fileName,
          functionName: "createEntitiesFromPrismaSchema",
        });

        void onEmitUserActionLog(
          `Import operation aborted due to errors. See the log for more details.`,
          EnumActionLogLevel.Error,
          EnumActionStepStatus.Failed,
          true
        );

        return [];
      } else {
        //Step 3: Create entities and fields
        const entities = await this.createBulkEntitiesAndFields(
          {
            resourceId,
            user,
            preparedEntitiesWithFields,
          },
          actionContext
        );

        this.logger.debug(`Import operation completed successfully`, {
          entitiesCount: entities.length,
        });

        void onEmitUserActionLog(
          `Import operation completed successfully.`,
          EnumActionLogLevel.Info,
          EnumActionStepStatus.Success,
          true
        );

        await this.analytics.track({
          userId: user.account.id,
          properties: {
            resourceId: resourceId,
            projectId: resourceWithProject.projectId,
            workspaceId: resourceWithProject.project.workspaceId,
            fileName: fileName,
            totalEntities: entities.length,
            totalFields: preparedEntitiesWithFields?.reduce(
              (acc, entity) => acc + (entity.fields?.length || 0),
              0
            ),
            $groups: {
              groupWorkspace: resourceWithProject.project.workspaceId,
            },
          },
          event: EnumEventType.ImportPrismaSchemaCompleted,
        });

        return entities;
      }
    } catch (error) {
      await this.analytics.track({
        userId: user.account.id,
        properties: {
          resourceId: resourceId,
          projectId: resourceWithProject.projectId,
          workspaceId: resourceWithProject.project.workspaceId,
          fileName: fileName,
          error: error.message,
          $groups: { groupWorkspace: resourceWithProject.project.workspaceId },
        },
        event: EnumEventType.ImportPrismaSchemaError,
      });
      this.logger.error(error.message, error, {
        resourceId,
        fileName,
        functionName: "createEntitiesFromPrismaSchema",
      });

      void onEmitUserActionLog(
        error.message,
        EnumActionLogLevel.Error,
        EnumActionStepStatus.Failed,
        true
      );

      return [];
    }
  }

  async validateBeforeCreateBulkEntitiesAndFields(
    preparedEntitiesWithFields: CreateBulkEntitiesInput[],
    resourceId: string,
    actionContext: ActionContext
  ) {
    const existingEntities = await this.entities({
      where: {
        name: {
          in: preparedEntitiesWithFields.map((entity) => entity.name),
        },
        resource: {
          id: resourceId,
        },
      },
    });

    if (existingEntities.length > 0) {
      existingEntities.forEach((entity) => {
        void actionContext.onEmitUserActionLog(
          `Entity "${entity.name}" already exists in the service. To proceed with the import, please rename or remove the entity in your schema file or remove the conflicting entity from the service.`,
          EnumActionLogLevel.Error
        );

        this.logger.error(
          `The following entities already exist: ${existingEntities
            .map((log) => log.id)
            .join(", ")}`
        );
      });
      return false;
    }
    return true;
  }

  async getRelatedFieldScalarTypeByRelatedEntityIdType(
    relatedEntityId: string
  ): Promise<EnumDataType> {
    const relatedIdField = await this.prisma.entityField.findFirst({
      where: {
        dataType: EnumDataType.Id,
        entityVersion: {
          entityId: relatedEntityId,
        },
      },
    });

    const idTypeMap = {
      CUID: EnumDataType.SingleLineText,
      UUID: EnumDataType.SingleLineText,
      AUTO_INCREMENT: EnumDataType.WholeNumber,
      AUTO_INCREMENT_BIG_INT: EnumDataType.WholeNumber,
    };

    const idTypeProp =
      relatedIdField.properties as unknown as types.Id["idType"];

    return idTypeMap[idTypeProp["idType"]];
  }

  async createBulkEntitiesAndFields(
    {
      resourceId,
      user,
      preparedEntitiesWithFields,
    }: CreateBulkEntitiesAndFieldsArgs,
    actionContext: ActionContext
  ): Promise<Entity[]> {
    const entities: Entity[] = [];
    for (const entity of preparedEntitiesWithFields) {
      const {
        id,
        name,
        displayName,
        pluralDisplayName,
        description,
        customAttributes,
      } = entity;

      try {
        const newEntity = await this.createOneEntity(
          {
            data: {
              resource: {
                connect: {
                  id: resourceId,
                },
              },
              id,
              name,
              displayName,
              pluralDisplayName,
              description,
              customAttributes,
            },
          },
          user,
          false,
          false,
          false
        );
        entities.push(newEntity);

        void actionContext.onEmitUserActionLog(
          `Entity "${newEntity.name}" created successfully`,
          EnumActionLogLevel.Info
        );
      } catch (error) {
        this.logger.error(error.message, error, { entity: entity.name });
        void actionContext.onEmitUserActionLog(
          `Failed to create entity "${entity.name}". ${error.message}`,
          EnumActionLogLevel.Error
        );
        throw new Error(
          `Failed to create entity "${entity.name}" due to ${error.message}`
        );
      }
    }

    for (const entity of entities) {
      const currentEntity = preparedEntitiesWithFields.find(
        (entityWithFields) => entity.name === entityWithFields.name
      );

      for (const field of currentEntity.fields) {
        const {
          relatedFieldName,
          relatedFieldDisplayName,
          relatedFieldAllowMultipleSelection,
          permanentId,
          ...rest
        } = field;
        try {
          await this.createField(
            {
              data: {
                ...rest,
                entity: {
                  connect: {
                    id: entity.id,
                  },
                },
              },
              relatedFieldName,
              relatedFieldDisplayName,
              relatedFieldAllowMultipleSelection,
            },
            user,
            permanentId, // here we want to use the permanentId that was created in the prisma parser service
            false
          );
        } catch (error) {
          this.logger.error(error.message, error, {
            field: field.name,
            entity: entity.name,
          });
          void actionContext.onEmitUserActionLog(
            `Failed to create entity field "${field.name}" on entity "${entity.name}". ${error.message}`,
            EnumActionLogLevel.Error,
            EnumActionStepStatus.Failed,
            true
          );
          throw new Error(
            `Failed to create entity field "${field.name}" on entity "${entity.name}" due to ${error.message}`
          );
        }
      }
    }

    return entities;
  }

  async createDefaultEntities(
    resourceId: string,
    user: User
  ): Promise<Entity[]> {
    return await Promise.all(
      DEFAULT_ENTITIES.map(async (entity) => {
        const { fields, ...rest } = entity;
        const newEntity = await this.createOneEntity(
          {
            data: {
              ...rest,
              resource: { connect: { id: resourceId } },
            },
          },
          user,
          false,
          false,
          false
        );

        await this.prisma.entityVersion.update({
          where: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            entityId_versionNumber: {
              entityId: newEntity.id,
              versionNumber: CURRENT_VERSION_NUMBER,
            },
          },
          data: {
            fields: {
              create: fields,
            },
          },
        });

        return newEntity;
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
    user: User,
    fieldStrategy = EnumRelatedFieldStrategy.Delete
  ): Promise<Entity | null> {
    return await this.useLocking(args.where.id, user, async (entity) => {
      const relatedEntityFields = await this.prisma.entityField.findMany({
        where: {
          dataType: EnumDataType.Lookup,
          properties: { path: ["relatedEntityId"], equals: args.where.id },
          entityVersion: { versionNumber: CURRENT_VERSION_NUMBER },
        },
        include: { entityVersion: true },
      });

      const serviceSettings =
        await this.serviceSettingsService.getServiceSettingsValues(
          {
            where: { id: entity.resourceId },
          },
          user
        );

      if (serviceSettings.authEntityName === entity.name) {
        throw new AmplicationError(
          `cannot delete auth entity : ${entity.name}.`
        );
      }

      for (const relatedEntityField of relatedEntityFields) {
        await this.deleteField(
          { where: { id: relatedEntityField.id } },
          user,
          fieldStrategy
        );
      }

      try {
        await this.moduleService.deleteDefaultModuleForEntity(
          entity.resourceId,
          entity.id,
          user
        );
      } catch (error) {
        //continue to delete the entity even if the deletion of the default module failed.
        //This is done in order to allow the user to workaround issues in any case when a default module is missing
        this.logger.error(
          "Continue with EntityDelete even though the default entity could not be deleted or was not found ",
          error
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
                  versionNumber: CURRENT_VERSION_NUMBER,
                },
              },
              data: {
                deleted: true,
              },
            },
          },
        },
      });
    });
  }

  async createCopiedEntityFieldByDisplayName(
    copiedEntityId: string,
    field: EntityField,
    user: User
  ): Promise<void> {
    try {
      await this.createFieldByDisplayName(
        {
          data: {
            entity: {
              connect: {
                id: copiedEntityId,
              },
            },
            displayName: pascalCase(field.name),
            dataType: field.dataType,
          },
        },
        user,
        false
      );
    } catch (error) {
      this.logger.error(error.message, error, {
        field: field.name,
        entityId: copiedEntityId,
      });
      throw new Error(
        `Failed to create entity field "${field.name}" on entityId "${copiedEntityId}" due to ${error.message}`
      );
    }
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
          deletedAt: null,
          project: {
            id: projectId,
          },
        },
      },
      include: {
        lockedByUser: true,
        resource: true,
        versions: {
          orderBy: {
            versionNumber: Prisma.SortOrder.desc,
          },
          /**find the first two versions to decide whether it is an update or a create */
          take: 2,
        },
      },
    });

    return changedEntities.map((entity) => {
      const [lastVersion] = entity.versions;
      const action = entity.deletedAt
        ? EnumPendingChangeAction.Delete
        : entity.versions.length > 1
        ? EnumPendingChangeAction.Update
        : EnumPendingChangeAction.Create;

      entity.versions =
        undefined; /**remove the versions data - it will only be returned if explicitly asked by gql */

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
        resource: entity.resource,
      };
    });
  }

  async getChangedEntitiesByCommit(commitId: string): Promise<PendingChange[]> {
    const changedEntity = await this.prisma.entity.findMany({
      where: {
        versions: {
          some: {
            commitId: commitId,
          },
        },
      },
      include: {
        lockedByUser: true,
        resource: true,
        versions: {
          where: {
            commitId: commitId,
          },
        },
      },
    });

    return changedEntity.map((entity) => {
      const [changedVersion] = entity.versions;
      const action = changedVersion.deleted
        ? EnumPendingChangeAction.Delete
        : changedVersion.versionNumber > 1
        ? EnumPendingChangeAction.Update
        : EnumPendingChangeAction.Create;

      //prepare name fields for display
      entity.name = changedVersion.name;
      entity.displayName = changedVersion.displayName;
      entity.pluralDisplayName = changedVersion.pluralDisplayName;

      return {
        originId: entity.id,
        action: action,
        originType: EnumPendingChangeOriginType.Entity,
        versionNumber: changedVersion.versionNumber,
        origin: entity,
        resource: entity.resource,
      };
    });
  }

  async updateOneEntity(
    args: UpdateOneEntityArgs,
    user: User
  ): Promise<Entity | null> {
    return await this.useLocking(args.where.id, user, async (entity) => {
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

      const resourceWithProject = await this.prisma.resource.findUnique({
        where: {
          id: entity.resourceId,
        },
        include: {
          project: true,
        },
      });

      await this.analytics.track({
        userId: user.account.id,
        properties: {
          resourceId: entity.resourceId,
          projectId: resourceWithProject.projectId,
          workspaceId: resourceWithProject.project.workspaceId,
          entityName: args.data.displayName,
          $groups: { groupWorkspace: resourceWithProject.project.workspaceId },
        },
        event: EnumEventType.EntityUpdate,
      });

      const updatedEntity = await this.prisma.entity.update({
        where: { ...args.where },
        data: {
          ...args.data,
          versions: {
            update: {
              where: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                entityId_versionNumber: {
                  entityId: args.where.id,
                  versionNumber: CURRENT_VERSION_NUMBER,
                },
              },
              data: {
                name: args.data.name,
                displayName: args.data.displayName,
                pluralDisplayName: args.data.pluralDisplayName,
                description: args.data.description,
                customAttributes: args.data.customAttributes,
              },
            },
          },
        },
      });

      try {
        await this.moduleService.updateDefaultModuleForEntity(
          {
            name: args.data.name,
            displayName: args.data.name,
          },
          updatedEntity,
          user
        );
      } catch (error) {
        if (error instanceof DefaultModuleForEntityNotFoundError) {
          //create a default module if it does not exist
          //This is done in order to allow the user to workaround issues in any case when a default module is missing
          this.logger.error(
            "Creating a default module and continue with UpdateEntity even though the default module could not be found ",
            error
          );
          await this.moduleService.createDefaultModuleForEntity(
            {
              data: {
                name: args.data.name,
                displayName: args.data.name,
                resource: {
                  connect: {
                    id: entity.resourceId,
                  },
                },
              },
            },
            updatedEntity,
            user
          );
        } else {
          throw error;
        }
      }

      return updatedEntity;
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
    const entityFields = await this.prisma.entityField.findMany({
      ...args,
      where: {
        ...args.where,
        entityVersion: {
          entityId: entityId,
          versionNumber: versionNumber,
        },
      },
    });

    return this.addDBNumericTypesIfMissing(entityFields);
  }

  /**
   * add missing databaseFieldType to numeric types for backward compatibility
   * INT for WholeNumber and type FLOAT for DecimalNumber
   * */
  addDBNumericTypesIfMissing(entityFields: EntityField[]) {
    return entityFields.map((field) => {
      if (field.dataType === EnumDataType.WholeNumber) {
        if (
          !(field.properties as unknown as types.WholeNumber)?.databaseFieldType
        ) {
          (field.properties as unknown as types.WholeNumber).databaseFieldType =
            "INT";
        }
      }
      if (field.dataType === EnumDataType.DecimalNumber) {
        if (
          !(field.properties as unknown as types.DecimalNumber)
            ?.databaseFieldType
        ) {
          (
            field.properties as unknown as types.DecimalNumber
          ).databaseFieldType = "FLOAT";
        }
      }
      return field;
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
        entityId,
      },
      orderBy: {
        versionNumber: Prisma.SortOrder.asc,
      },
      include: {
        fields: {
          orderBy: {
            permanentId: Prisma.SortOrder.asc,
          },
        },
        permissions: {
          orderBy: {
            action: Prisma.SortOrder.asc,
          },
          include: {
            permissionFields: {
              orderBy: {
                fieldPermanentId: Prisma.SortOrder.asc,
              },
              include: {
                permissionRoles: {
                  orderBy: {
                    resourceRoleId: Prisma.SortOrder.asc,
                  },
                },
              },
            },
            permissionRoles: {
              orderBy: {
                resourceRoleId: Prisma.SortOrder.asc,
              },
              include: {
                resourceRole: true,
              },
            },
          },
        },
      },
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
        id: entityId,
      },
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
        id: entityId,
      },
      data: {
        lockedByUser: {
          connect: {
            id: user.id,
          },
        },
        lockedAt: new Date(),
      },
    });
  }

  async releaseLock(entityId: string): Promise<Entity | null> {
    /**@todo: consider adding validation on the current user locking the entity */
    return this.prisma.entity.update({
      where: {
        id: entityId,
      },
      data: {
        lockedByUser: {
          disconnect: true,
        },
        lockedAt: null,
      },
    });
  }

  async createVersion(
    args: CreateOneEntityVersionArgs
  ): Promise<EntityVersion> {
    /**@todo: consider adding validation on the current user locking the entity */

    const entityId = args.data.entity.connect.id;
    const entityVersions = await this.prisma.entityVersion.findMany({
      where: {
        entity: { id: entityId },
      },
      orderBy: {
        versionNumber: Prisma.SortOrder.asc,
      },
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
        customAttributes: firstEntityVersion.customAttributes,
        commit: {
          connect: {
            id: args.data.commit.connect.id,
          },
        },
        versionNumber: nextVersionNumber,
        entity: {
          connect: {
            id: args.data.entity.connect.id,
          },
        },
      },
    });

    return this.cloneVersionData(firstEntityVersion.id, newEntityVersion.id);
  }

  async discardPendingChanges(
    entity: EntityPendingChange,
    user: User
  ): Promise<Entity> {
    const { originId } = entity;

    const entityVersions = await this.prisma.entityVersion.findMany({
      where: {
        entity: { id: originId },
      },
      orderBy: {
        versionNumber: Prisma.SortOrder.asc,
      },
      include: {
        entity: true,
      },
    });

    const firstEntityVersion = head(entityVersions);
    const lastEntityVersion = last(entityVersions);

    if (!firstEntityVersion || !lastEntityVersion) {
      throw new AmplicationError(`Entity ${originId} has no versions `);
    }

    if (firstEntityVersion.entity.lockedByUserId !== user.id) {
      throw new AmplicationError(
        `Cannot discard pending changes on Entity ${originId} since it is not currently locked by the requesting user `
      );
    }

    await this.cloneVersionData(lastEntityVersion.id, firstEntityVersion.id);

    if (entity.action === EnumPendingChangeAction.Create) {
      await this.deleteOneEntity({ where: { id: originId } }, user);
    }

    return this.releaseLock(originId);
  }

  private async cloneVersionData(
    sourceVersionId: string,
    targetVersionId: string
  ): Promise<EntityVersion> {
    const sourceVersion = await this.prisma.entityVersion.findUnique({
      where: {
        id: sourceVersionId,
      },
      include: {
        fields: true,
        permissions: {
          include: {
            permissionRoles: true,
            permissionFields: {
              include: {
                permissionRoles: true,
                field: true,
              },
            },
          },
        },
      },
    });

    if (!sourceVersion) {
      throw new AmplicationError(
        `Can't find source (Entity Version ${sourceVersionId})`
      );
    }

    let targetVersion = await this.prisma.entityVersion.findUnique({
      where: {
        id: targetVersionId,
      },
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
          entityVersionId: targetVersionId,
        },
      });

      await this.prisma.entityPermissionRole.deleteMany({
        where: {
          entityVersionId: targetVersionId,
        },
      });

      targetVersion = await this.prisma.entityVersion.update({
        where: {
          id: targetVersionId,
        },
        data: {
          fields: {
            deleteMany: {
              entityVersionId: targetVersionId,
            },
          },
          permissions: {
            deleteMany: {
              entityVersionId: targetVersionId,
            },
          },
        },
      });
    }

    // Duplicate the fields of the source version, omitting entityVersionId and
    // id properties.
    const duplicatedFields = sourceVersion.fields.map((field) =>
      omit(field, ["entityVersionId", "id"])
    );

    const names = pick(sourceVersion, [
      "name",
      "displayName",
      "pluralDisplayName",
      "customAttributes",
      "description",
    ]);

    //update the target version with its fields, and the its parent entity
    targetVersion = await this.prisma.entityVersion.update({
      where: {
        id: targetVersionId,
      },
      data: {
        //when the source target is flagged as deleted (commit on DELETE action), do not update the parent entity
        entity: sourceVersion.deleted
          ? undefined
          : {
              update: {
                ...names,
                deletedAt: null,
              },
            },
        ...names,
        fields: {
          create: duplicatedFields,
        },
      },
    });

    //prepare the permissions object
    const createPermissionsData: Prisma.EntityPermissionCreateNestedManyWithoutEntityVersionInput =
      {
        create: sourceVersion.permissions.map((permission) => {
          return {
            action: permission.action,
            type: permission.type,
            permissionRoles: {
              create: permission.permissionRoles.map((permissionRole) => {
                return {
                  resourceRole: {
                    connect: {
                      id: permissionRole.resourceRoleId,
                    },
                  },
                };
              }),
            },
          };
        }),
      };

    targetVersion = await this.prisma.entityVersion.update({
      where: {
        id: targetVersionId,
      },
      data: {
        permissions: createPermissionsData,
      },
    });

    await Promise.all(
      sourceVersion.permissions.map((permission) => {
        return this.prisma.entityPermission.update({
          where: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            entityVersionId_action: {
              action: permission.action,
              entityVersionId: targetVersionId,
            },
          },
          data: {
            permissionFields: {
              create: permission.permissionFields.map((permissionField) => {
                return {
                  field: {
                    connect: {
                      // eslint-disable-next-line @typescript-eslint/naming-convention
                      entityVersionId_permanentId: {
                        entityVersionId: targetVersionId,
                        permanentId: permissionField.fieldPermanentId,
                      },
                    },
                  },
                  permissionRoles: {
                    connect: permissionField.permissionRoles.map(
                      (fieldRole) => {
                        return {
                          // eslint-disable-next-line @typescript-eslint/naming-convention
                          entityVersionId_action_resourceRoleId: {
                            action: fieldRole.action,
                            entityVersionId: targetVersionId,
                            resourceRoleId: fieldRole.resourceRoleId,
                          },
                        };
                      }
                    ),
                  },
                };
              }),
            },
          },
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
        deletedAt: null,
      },
      select: {
        versions: {
          where: {
            versionNumber: {
              not: CURRENT_VERSION_NUMBER,
            },
          },
          take: 1,
          orderBy: {
            versionNumber: Prisma.SortOrder.desc,
          },
        },
      },
    });

    return entities
      .filter((entity) => entity.versions.length > 0)
      .map((entity) => entity.versions[0]);
  }

  async getVersionCommit(entityVersionId: string): Promise<Commit> {
    const version = this.prisma.entityVersion.findUnique({
      where: {
        id: entityVersionId,
      },
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
          id: resourceId,
        },
        deletedAt: null,
      },
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
          in: Array.from(uniqueNames),
        },
        entityVersion: {
          entityId: entityId,
          versionNumber: CURRENT_VERSION_NUMBER,
        },
      },
      select: { name: true },
    });

    const matchingNames = new Set(matchingFields.map(({ name }) => name));

    return new Set([...uniqueNames].filter((x) => !matchingNames.has(x)));
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
            versionNumber: CURRENT_VERSION_NUMBER,
          },
        },
      });

      const entityVersionId = entityVersion.id;

      return this.prisma.entityPermission.upsert({
        create: {
          ...args.data,
          entityVersion: {
            connect: {
              id: entityVersionId,
            },
          },
        },
        update: {
          type: args.data.type,
        },
        where: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          entityVersionId_action: {
            entityVersionId: entityVersionId,
            action: args.data.action,
          },
        },
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
              versionNumber: CURRENT_VERSION_NUMBER,
            },
          },
        });
        const entityVersionId = entityVersion.id;

        const promises: Promise<any>[] = [];

        //add new roles
        if (!isEmpty(args.data.addRoles)) {
          const entityId = args.data.entity.connect.id;
          const entityWithResource = await this.prisma.entity.findUnique({
            where: {
              id: entityId,
            },
            include: {
              resource: {
                include: {
                  project: true,
                },
              },
            },
          });

          if (!entityWithResource || !entityWithResource.resource) {
            throw new NotFoundException(`Entity ${entityId} not found`);
          }

          await this.checkServiceLicense(entityWithResource.resource);

          const createMany = args.data.addRoles.map((role) => {
            return {
              resourceRole: {
                connect: {
                  id: role.id,
                },
              },
            };
          });

          promises.push(
            this.prisma.entityPermission.update({
              where: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                entityVersionId_action: {
                  entityVersionId: entityVersionId,
                  action: args.data.action,
                },
              },
              data: {
                permissionRoles: {
                  create: createMany,
                },
              },
            })
          );
        }

        //delete existing roles
        if (!isEmpty(args.data.deleteRoles)) {
          promises.push(
            this.prisma.entityPermissionRole.deleteMany({
              where: {
                resourceRoleId: {
                  in: args.data.deleteRoles.map((role) => role.id),
                },
              },
            })
          );
        }
        await Promise.all(promises);

        const results = await this.prisma.entityPermission.findMany({
          where: {
            entityVersion: {
              entityId: args.data.entity.connect.id,
              versionNumber: CURRENT_VERSION_NUMBER,
            },
            action: args.data.action,
          },
          include: {
            permissionRoles: {
              include: {
                resourceRole: true,
              },
            },
            permissionFields: {
              include: {
                field: true,
                permissionRoles: {
                  include: {
                    resourceRole: true,
                  },
                },
              },
            },
          },
          take: 1,
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
            deletedAt: null,
          },
        },
        action: action,
      },
      orderBy: {
        action: Prisma.SortOrder.asc,
      },
      include: {
        permissionRoles: {
          orderBy: {
            resourceRoleId: Prisma.SortOrder.asc,
          },
          include: {
            resourceRole: true,
          },
        },
        permissionFields: {
          orderBy: {
            fieldPermanentId: Prisma.SortOrder.asc,
          },
          include: {
            field: true,
            permissionRoles: {
              orderBy: {
                resourceRoleId: Prisma.SortOrder.asc,
              },
              include: {
                resourceRole: true,
              },
            },
          },
        },
      },
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
            `Invalid field selected: ${Array.from(nonMatchingNames).join(", ")}`
          );
        }

        const entityVersion = await this.prisma.entityVersion.findUnique({
          where: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            entityId_versionNumber: {
              entityId: args.data.entity.connect.id,
              versionNumber: CURRENT_VERSION_NUMBER,
            },
          },
        });
        const entityVersionId = entityVersion.id;

        return this.prisma.entityPermissionField.create({
          data: {
            field: {
              connect: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                entityVersionId_name: {
                  entityVersionId: entityVersionId,
                  name: args.data.fieldName,
                },
              },
            },
            permission: {
              connect: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                entityVersionId_action: {
                  entityVersionId: entityVersionId,
                  action: args.data.action,
                },
              },
            },
          },
          include: {
            field: true,
          },
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
              versionNumber: CURRENT_VERSION_NUMBER,
            },
            action: args.where.action,
          },
          fieldPermanentId: args.where.fieldPermanentId,
        },
      });

      if (isEmpty(permissionField)) {
        throw new AmplicationError(`Record not found`);
      }

      const id = permissionField[0].id;

      return this.prisma.entityPermissionField.delete({
        where: {
          id: id,
        },
        include: {
          field: true,
        },
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
        id: args.data.permissionField.connect.id,
      },
      include: {
        permission: {
          include: {
            entityVersion: true,
          },
        },
      },
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
        const createMany = args.data.addPermissionRoles.map(
          (permissionRole) => {
            return {
              id: permissionRole.id,
            };
          }
        );

        promises.push(
          this.prisma.entityPermissionField.update({
            where: {
              id: args.data.permissionField.connect.id,
            },
            data: {
              permissionRoles: {
                connect: createMany,
              },
            },
          })
        );
      }

      //delete existing roles
      if (!isEmpty(args.data.deletePermissionRoles)) {
        const deleteMany = args.data.deletePermissionRoles.map(
          (permissionRole) => {
            return {
              id: permissionRole.id,
            };
          }
        );

        promises.push(
          this.prisma.entityPermissionField.update({
            where: {
              id: args.data.permissionField.connect.id,
            },
            data: {
              permissionRoles: {
                disconnect: deleteMany,
              },
            },
          })
        );
      }
      await Promise.all(promises);

      return this.prisma.entityPermissionField.findUnique({
        where: {
          id: args.data.permissionField.connect.id,
        },
        include: {
          field: true,
          permissionRoles: {
            include: {
              resourceRole: true,
            },
          },
        },
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
      const schemaValidation =
        await this.jsonSchemaValidationService.validateSchema(schema, data);

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
    user: User,
    trackEvent = false
  ): Promise<EntityField> {
    const entity = await this.entity({
      where: args.data.entity.connect,
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
      ...createInput,
    };

    const createFieldArgs: CreateOneEntityFieldArgs = { data };

    // In case created data type is Lookup define related field names according
    // to the entity
    if (data.dataType === EnumDataType.Lookup) {
      const { allowMultipleSelection: entityFieldAllowMultipleSelection } =
        data.properties as unknown as types.Lookup;

      createFieldArgs.relatedFieldName = camelCase(
        !entityFieldAllowMultipleSelection
          ? entity.pluralDisplayName
          : entity.name
      );

      createFieldArgs.relatedFieldDisplayName =
        !entityFieldAllowMultipleSelection
          ? entity.pluralDisplayName
          : entity.displayName;

      createFieldArgs.relatedFieldAllowMultipleSelection =
        !entityFieldAllowMultipleSelection;
    }

    return this.createField(createFieldArgs, user, null, true, trackEvent);
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
    } else if (lowerCaseName.includes("date")) {
      dataType = EnumDataType.DateTime;
    } else if (
      lowerCaseName.includes("description") ||
      lowerCaseName.includes("comments")
    ) {
      dataType = EnumDataType.MultiLineText;
    } else if (lowerCaseName.includes("email")) {
      dataType = EnumDataType.Email;
    } else if (lowerCaseName.includes("status")) {
      dataType = EnumDataType.OptionSet;
    } else if (lowerCaseName.startsWith("is")) {
      dataType = EnumDataType.Boolean;
    } else if (lowerCaseName.includes("price")) {
      dataType = EnumDataType.DecimalNumber;
    } else if (
      lowerCaseName.includes("quantity") ||
      lowerCaseName.includes("qty")
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
              allowMultipleSelection,
            },
          };
        }
      }
    }

    return {
      name,
      dataType: dataType || EnumDataType.SingleLineText,
      properties:
        DATA_TYPE_TO_DEFAULT_PROPERTIES[
          dataType || EnumDataType.SingleLineText
        ],
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
      where: createEntityNamesWhereInput(name, resourceId),
    });
  }

  validateFieldMutationArgs(
    args: CreateOneEntityFieldArgs | UpdateOneEntityFieldArgs,
    entity: Entity
  ): void {
    const { data, relatedFieldName, relatedFieldDisplayName } = args;
    if (data.dataType === EnumDataType.Lookup) {
      const { relatedFieldId } = data.properties as unknown as types.Lookup;
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
    entity: Entity,
    enforceValidation: boolean
  ): Promise<void> {
    // Validate the field's name
    validateFieldName(data.name);

    if (
      enforceValidation &&
      data.dataType === EnumDataType.Id &&
      isBasePropertyIdFieldPayloadChanged(data)
    ) {
      throw new DataConflictError(
        "The base properties of the ID field cannot be edited"
      );
    }

    if (isUserEntity(entity)) {
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
    user: User,
    permanentId?: string,
    enforceValidation = true,
    trackEvent = false
  ): Promise<EntityField> {
    const entityId = args.data.entity.connect.id;
    const entityWithResource = await this.prisma.entity.findUnique({
      where: {
        id: entityId,
      },
      include: {
        resource: {
          include: {
            project: true,
          },
        },
      },
    });

    if (!entityWithResource || !entityWithResource.resource) {
      throw new NotFoundException(`Entity ${entityId} not found`);
    }

    await this.checkServiceLicense(entityWithResource.resource);

    if (
      enforceValidation &&
      isReservedName(args.data?.name?.toLowerCase().trim())
    ) {
      throw new ReservedNameError(args.data?.name?.toLowerCase().trim());
    }

    // Omit entity from received data
    const data = omit(args.data, ["entity"]);

    return await this.useLocking(
      args.data.entity.connect.id,
      user,
      async (entity) => {
        // Validate args
        this.validateFieldMutationArgs(args, entity);

        if (args.data.dataType === EnumDataType.Lookup) {
          // If field data type is Lookup add relatedFieldId to field properties
          args.data.properties.relatedFieldId = cuid();
        }

        // Validate data
        await this.validateFieldData(data, entity, enforceValidation);

        // Create field ID ahead of time so it can be used in the related field creation
        const fieldId = cuid();

        if (args.data.dataType === EnumDataType.Lookup) {
          // Cast the received properties to Lookup properties type
          const properties = args.data.properties as unknown as types.Lookup;

          // Create a related lookup field in the related entity
          await this.createRelatedField(
            properties.relatedFieldId,
            args.relatedFieldName,
            args.relatedFieldDisplayName,
            args.relatedFieldAllowMultipleSelection,
            properties.relatedEntityId,
            entity.id,
            permanentId ?? fieldId, // if permanentId was provided use it, otherwise use the fieldId
            user,
            properties.fkHolder
          );
        }

        if (trackEvent) {
          const resourceWithProject = await this.prisma.resource.findUnique({
            where: {
              id: entity.resourceId,
            },
            include: {
              project: true,
            },
          });

          await this.analytics.track({
            userId: user.account.id,
            properties: {
              resourceId: entity.resourceId,
              projectId: resourceWithProject.projectId,
              workspaceId: resourceWithProject.project.workspaceId,
              entityFieldName: args.data.displayName,
              dataType: args.data.dataType,
              $groups: {
                groupWorkspace: resourceWithProject.project.workspaceId,
              },
            },
            event: EnumEventType.EntityFieldCreate,
          });
        }

        // Create entity field
        const newField = await this.prisma.entityField.create({
          data: {
            ...data,
            permanentId: permanentId ?? fieldId, // if permanentId was provided use it, otherwise use the fieldId
            entityVersion: {
              connect: {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                entityId_versionNumber: {
                  entityId: entity.id,
                  versionNumber: CURRENT_VERSION_NUMBER,
                },
              },
            },
          },
        });

        if (args.data.dataType === EnumDataType.Lookup) {
          const moduleId = await this.moduleService.getDefaultModuleIdForEntity(
            entity.resourceId,
            entity.id
          );

          await this.moduleActionService.createDefaultActionsForRelationField(
            entity,
            newField,
            moduleId,
            user
          );
        }

        return newField;
      }
    );
  }

  private async createRelatedField(
    id: string,
    name: string,
    displayName: string,
    relatedFieldAllowMultipleSelection: boolean,
    entityId: string,
    relatedEntityId: string,
    relatedFieldId: string,
    user: User,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    fkHolder?: string
  ): Promise<EntityField> {
    return await this.useLocking(entityId, user, async () => {
      const newField = await this.prisma.entityField.create({
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
                versionNumber: CURRENT_VERSION_NUMBER,
              },
            },
          },
          properties: {
            allowMultipleSelection: relatedFieldAllowMultipleSelection,
            relatedEntityId,
            relatedFieldId,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            fkHolder,
          },
        },
      });

      const entity = await this.entity({ where: { id: entityId } });

      const moduleId = await this.moduleService.getDefaultModuleIdForEntity(
        entity.resourceId,
        entityId
      );

      await this.moduleActionService.createDefaultActionsForRelationField(
        entity,
        newField,
        moduleId,
        user
      );

      return newField;
    });
  }

  private async deleteRelatedField(
    permanentId: string,
    entityId: string,
    user: User
  ): Promise<void> {
    await this.useLocking(entityId, user, async (entity) => {
      // Get field to delete
      const field = await this.getField({
        where: {
          permanentId,
        },
      });

      // Delete the related field from the database
      const deletedField = await this.prisma.entityField.delete({
        where: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          entityVersionId_permanentId: {
            permanentId,
            entityVersionId: field.entityVersionId,
          },
        },
      });

      const moduleId = await this.moduleService.getDefaultModuleIdForEntity(
        entity.resourceId,
        entity.id
      );

      await this.moduleActionService.deleteDefaultActionsForRelationField(
        deletedField,
        moduleId,
        user
      );
    });
  }

  async updateField(
    args: UpdateOneEntityFieldArgs,
    user: User,
    enforceValidation = true
  ): Promise<EntityField> {
    if (isReservedName(args.data?.name?.toLowerCase().trim())) {
      throw new ReservedNameError(args.data?.name?.toLowerCase().trim());
    }

    // Get field to update
    const field = await this.getField({
      where: args.where,
      include: { entityVersion: true },
    });

    if (
      enforceValidation &&
      field.dataType === EnumDataType.Id &&
      isBasePropertyIdFieldPayloadChanged(args.data)
    ) {
      throw new DataConflictError(
        "The base properties of the ID field cannot be edited"
      );
    }
    const { minimumValue, maximumValue } = args?.data
      ?.properties as unknown as {
      minimumValue: number;
      maximumValue: number;
    };
    if (minimumValue && minimumValue >= maximumValue) {
      throw new BadRequestException(NUMBER_WITH_INVALID_MINIMUM_VALUE);
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
        (field.properties as unknown as types.Lookup)?.relatedEntityId;

    const shouldUpdateRelatedFieldActions =
      args.data.dataType === EnumDataType.Lookup &&
      field.dataType === EnumDataType.Lookup &&
      (field.name !== args.data.name ||
        field.displayName !== args.data.displayName ||
        (field.properties as unknown as types.Lookup).allowMultipleSelection !==
          (args.data.properties as unknown as types.Lookup)
            .allowMultipleSelection);

    return await this.useLocking(
      field.entityVersion.entityId,
      user,
      async (entity) => {
        // Validate args
        this.validateFieldMutationArgs(args, entity);

        // In case related field should be created or changed, assign properties a
        // new related field ID
        if (shouldCreateRelated || shouldChangeRelated) {
          args.data.properties.relatedFieldId = cuid();
        }

        // Validate data
        await this.validateFieldData(args.data, entity, enforceValidation);

        /**
         * @todo validate the field was not published - only specific properties of
         * fields that were already published can be updated
         */

        // In case related field should be deleted or changed, delete the existing related field
        if (shouldDeleteRelated || shouldChangeRelated) {
          const properties = field.properties as unknown as types.Lookup;
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
          const properties = args.data.properties as unknown as types.Lookup;

          await this.createRelatedField(
            properties.relatedFieldId,
            args.relatedFieldName,
            args.relatedFieldDisplayName,
            args.relatedFieldAllowMultipleSelection,
            properties.relatedEntityId,
            entity.id,
            field.permanentId,
            user,
            properties.fkHolder
          );
        }

        const updatedField = await this.prisma.entityField.update(
          omit(args, [
            "relatedFieldName",
            "relatedFieldDisplayName",
            "relatedFieldAllowMultipleSelection",
          ])
        );

        //update the names of the related field actions, in case the field name was changed
        if (shouldUpdateRelatedFieldActions) {
          const moduleId = await this.moduleService.getDefaultModuleIdForEntity(
            entity.resourceId,
            entity.id
          );

          await this.moduleActionService.updateDefaultActionsForRelationField(
            entity,
            updatedField,
            moduleId,
            user
          );
        }

        const updateFieldProperties =
          updatedField.properties as unknown as types.Lookup;

        if (
          field.dataType === EnumDataType.Lookup &&
          updateFieldProperties?.fkHolder !== null
        ) {
          // Get related field to update
          const relatedField = await this.getField({
            where: {
              permanentId: updateFieldProperties.relatedFieldId,
            },
            include: { entityVersion: true },
          });

          const relatedFieldProps =
            relatedField.properties as unknown as types.Lookup;

          relatedFieldProps.fkHolder = (
            updatedField.properties as unknown as types.Lookup
          )?.fkHolder;

          await this.prisma.entityField.update({
            where: {
              id: relatedField.id,
            },
            data: {
              properties: relatedFieldProps as unknown as Prisma.InputJsonValue,
            },
          });
        }

        const resourceWithProject = await this.prisma.resource.findUnique({
          where: {
            id: entity.resourceId,
          },
          include: {
            project: true,
          },
        });

        await this.analytics.track({
          userId: user.account.id,
          properties: {
            resourceId: entity.resourceId,
            projectId: resourceWithProject.projectId,
            workspaceId: resourceWithProject.project.workspaceId,
            entityFieldName: args.data.displayName,
            dataType: args.data.dataType,
            $groups: {
              groupWorkspace: resourceWithProject.project.workspaceId,
            },
          },
          event: EnumEventType.EntityFieldUpdate,
        });

        return updatedField;
      }
    );
  }

  async deleteField(
    args: DeleteEntityFieldArgs,
    user: User,
    fieldStrategy = EnumRelatedFieldStrategy.Delete
  ): Promise<EntityField | null> {
    const field = await this.getField({
      ...args,
      include: {
        entityVersion: true,
      },
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
      async (entity) => {
        if (field.dataType === EnumDataType.Lookup) {
          // Cast the field properties as Lookup properties
          const properties = field.properties as unknown as types.Lookup;
          if (fieldStrategy === EnumRelatedFieldStrategy.Delete) {
            try {
              await this.deleteRelatedField(
                properties.relatedFieldId,
                properties.relatedEntityId,
                user
              );
            } catch (error) {
              //continue to delete the field even if the deletion of the related field failed.
              //This is done in order to allow the user to workaround issues in any case when a related field is missing
              this.logger.error(
                "Continue with FieldDelete even though the related field could not be deleted or was not found ",
                error
              );
            }
          } else if (
            fieldStrategy === EnumRelatedFieldStrategy.UpdateToScalar
          ) {
            field.dataType = properties.allowMultipleSelection
              ? EnumDataType.Json
              : await this.getRelatedFieldScalarTypeByRelatedEntityIdType(
                  properties.relatedEntityId
                );

            const data: EntityFieldUpdateInput = {
              dataType: field.dataType,
              name: field.name,
              displayName: field.displayName,
              properties: DATA_TYPE_TO_DEFAULT_PROPERTIES[field.dataType],
            };

            await this.updateField(
              {
                data,
                where: {
                  id: args.where.id,
                },
              },
              user
            );

            return;
          }
        }

        const deletedField = await this.prisma.entityField
          .delete({
            where: {
              id: args.where.id,
            },
          })
          // Continue with the rest of the delete even if the field was not found
          // This is done in order to allow the user to workaround issues in any case when a field has been deleted before
          // Currently deleteIfExists doesn't exist. Tracking issue :- https://github.com/prisma/prisma/issues/4072
          .catch((error) => {
            if (error.code === "P2025") {
              this.logger.error(
                "Continue with the rest of the deletion even though the field was not found ",
                error
              );

              return null;
            }

            throw new AmplicationError(error);
          });

        if (deletedField) {
          const moduleId = await this.moduleService.getDefaultModuleIdForEntity(
            entity.resourceId,
            entity.id
          );

          await this.moduleActionService.deleteDefaultActionsForRelationField(
            deletedField,
            moduleId,
            user
          );
        }

        return deletedField;
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
  async getField(args: Prisma.EntityFieldFindFirstArgs): Promise<EntityField> {
    const field = await this.prisma.entityField.findFirst({
      ...args,
      where: {
        ...args.where,
        entityVersion: {
          versionNumber: CURRENT_VERSION_NUMBER,
        },
      },
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

function isUserEntity(entity: Entity): boolean {
  return entity.name === USER_ENTITY_NAME;
}

/**
 * @param data the payload from the request
 * @return (boolean) true if the base properties of the ID field are changed,
 * meaning that the base properties of the ID field from the payload are different
 * from the base properties of the ID field from the initial state (INITIAL_ID_TYPE_FIELDS)
 */
function isBasePropertyIdFieldPayloadChanged(
  data: EntityFieldUpdateInput
): boolean {
  const PROPERTIES_TO_VALIDATE = [NAME, DATA_TYPE, SEARCHABLE];

  const idTypeData = {
    ...INITIAL_ID_TYPE_FIELDS,
    createdAt: undefined,
    updatedAt: undefined,
  };

  const idTypeDataWithSelectedProperties = pick(
    idTypeData,
    PROPERTIES_TO_VALIDATE
  );
  const dataWithSelectedProperties = pick(data, PROPERTIES_TO_VALIDATE);

  return !isEqual(dataWithSelectedProperties, idTypeDataWithSelectedProperties);
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
          mode: Prisma.QueryMode.insensitive,
        },
      },
      {
        pluralDisplayName: {
          equals: name,
          mode: Prisma.QueryMode.insensitive,
        },
      },
      {
        name: {
          equals: name,
          mode: Prisma.QueryMode.insensitive,
        },
      },
    ],
  };
}
