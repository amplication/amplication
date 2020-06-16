import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderByArg } from '@prisma/client';
import head from 'lodash.head';
import last from 'lodash.last';
import omit from 'lodash.omit';
import { Entity, EntityField, EntityVersion } from 'src/models';
import { PrismaService } from 'src/services/prisma.service';

import {
  CreateOneEntityArgs,
  FindManyEntityArgs,
  FindOneEntityArgs,
  UpdateOneEntityArgs,
  CreateOneEntityVersionArgs,
  FindManyEntityVersionArgs,
  DeleteOneEntityArgs
} from './dto';
import { CURRENT_VERSION_NUMBER } from '../entityField/constants';

const NEW_VERSION_LABEL = 'Current Version';

@Injectable()
export class EntityService {
  constructor(private readonly prisma: PrismaService) {}

  async entity(args: FindOneEntityArgs): Promise<Entity | null> {
    // let version, findArgs;
    // ({ version, ...findArgs } = args);
    // // return this.prisma.entity.findOne(findArgs);

    //
    const entityVersion = await this.getEntityVersion(
      args.where.id,
      args.version
    );

    if (!entityVersion) {
      throw new NotFoundException(`Cannot find entity`); //todo: change phrasing
    }

    const entity: Entity = await this.prisma.entity.findOne({
      where: {
        id: args.where.id
      }
    });

    entity.versionNumber = entityVersion.versionNumber;

    entity.fields = await this.getEntityFields(entity);

    return entity;
  }

  async entities(args: FindManyEntityArgs): Promise<Entity[]> {
    return this.prisma.entity.findMany(args);
  }

  async createOneEntity(args: CreateOneEntityArgs): Promise<Entity> {
    const newEntity = await this.prisma.entity.create(args);
    // Creates first entry on EntityVersion by default when new entity is created
    await this.prisma.entityVersion.create({
      data: {
        label: NEW_VERSION_LABEL,
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

  async deleteOneEntity(args: DeleteOneEntityArgs): Promise<Entity | null> {
    return this.prisma.entity.delete(args);
  }

  async updateOneEntity(args: UpdateOneEntityArgs): Promise<Entity | null> {
    return this.prisma.entity.update(args);
  }

  async getEntityFields(entity: Entity): Promise<EntityField[]> {
    //todo: find the fields of the specific version number

    const entityVersion = await this.getEntityVersion(
      entity.id,
      entity.versionNumber
    );

    let latestVersionId = '';
    if (entityVersion) {
      latestVersionId = entityVersion.id;
    }

    const entityFieldsByLastVersion = await this.prisma.entityField.findMany({
      where: {
        entityVersion: { id: latestVersionId }
      },
      orderBy: { createdAt: OrderByArg.asc }
    });

    return entityFieldsByLastVersion;
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
        orderBy: { versionNumber: OrderByArg.asc }
      });
    }
    return (
      (entityVersions && entityVersions.length && entityVersions[0]) || null
    );
  }

  async createVersion(
    args: CreateOneEntityVersionArgs
  ): Promise<EntityVersion> {
    const entityId = args.data.entity.connect.id;
    const entityVersions = await this.prisma.entityVersion.findMany({
      where: {
        entity: { id: entityId }
      }
    });
    const firstEntityVersion = head(entityVersions);
    const lastEntityVersion = last(entityVersions);
    if (!firstEntityVersion) {
      throw new Error(`Entity ${entityId} has no versions`);
    }
    const lastVersionNumber = lastEntityVersion.versionNumber;

    // Get entity fields from it's first version
    const firstEntityVersionFields = await this.prisma.entityField.findMany({
      where: {
        entityVersion: { id: firstEntityVersion.id }
      }
    });

    // Duplicate the fields of the first version, omitting entityVersionId and
    // id properties.
    const duplicatedFields = firstEntityVersionFields.map(field =>
      omit(field, ['entityVersionId', 'id'])
    );

    const nextVersionNumber = lastVersionNumber + 1;

    const newEntityVersion = await this.prisma.entityVersion.create({
      data: {
        label: args.data.label,
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

  /*validate that all the listed field names exist in the entity*/
  async validateAllFieldsExist(
    entityId: string,
    fieldNames: string[]
  ): Promise<boolean> {
    const uniqueNames = [...new Set(fieldNames)];

    const fields = (
      await this.prisma.entityField.findMany({
        where: {
          name: {
            in: uniqueNames
          },
          entityVersion: {
            entityId: entityId,
            versionNumber: CURRENT_VERSION_NUMBER
          }
        }
      })
    ).map(x => x.name);

    if (fields && fields.length === uniqueNames.length) return true;

    /**  @todo: find which fields are not valid and throw and exception or return the invalid names */

    return false;
  }
}
