import { Injectable, NotFoundException } from '@nestjs/common';
import { Entity, EntityField, EntityVersion } from '../../models';
import { PrismaService } from '../../services/prisma.service';
import {
  UserRoleCreateArgs,
  FindManyEntityVersionArgs,
  OrderByArg
} from '@prisma/client';

import {
  CreateOneEntityArgs,
  FindManyEntityArgs,
  FindOneEntityArgs,
  UpdateOneEntityArgs,
  CreateOneEntityVersionArgs
} from '../../dto/args';

@Injectable()
export class EntityService {
  constructor(private readonly prisma: PrismaService) {}

  async entity(args: FindOneEntityArgs): Promise<Entity | null> {
    let version, findArgs;
    ({ version, ...findArgs } = args);
    // return this.prisma.entity.findOne(findArgs);

    //
    let entityVersion = await this.getEntityVersion(
      args.where.id,
      args.version
    );

    if (!entityVersion) {
      throw new NotFoundException(`Cannot find entity`); //todo: change phrasing
    }

    let entity: Entity = await this.prisma.entity.findOne(findArgs);

    entity.versionNumber = entityVersion.versionNumber;

    entity.entityFields = await this.getEntityFields(entity);

    return entity;
  }

  async entities(args: FindManyEntityArgs): Promise<Entity[]> {
    return this.prisma.entity.findMany(args);
  }

  async createOneEntity(args: CreateOneEntityArgs): Promise<Entity> {
    const newEntity = await this.prisma.entity.create(args);
    // Creates first entry on EntityVersion by default when new entity is created
    const newEntityVersion = await this.prisma.entityVersion.create({
      data: {
        label: args.data.name + ' currant version',
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

  // async deleteOneEntity(@Context() ctx: any, @Args() args: DeleteOneEntityArgs): Promise<Entity | null> {
  //   return ctx.prisma.entity.delete(args);
  // }

  async updateOneEntity(args: UpdateOneEntityArgs): Promise<Entity | null> {
    return this.prisma.entity.update(args);
  }

  async getEntityFields(entity: Entity): Promise<EntityField[]> {
    //todo: find the fields of the specific version number

    let entityVersion = await this.getEntityVersion(
      entity.id,
      entity.versionNumber
    );

    let latestVersion = -1,
      latestVersionId = '';
    if (entityVersion) {
      latestVersion = entityVersion.versionNumber;
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

  private async getEntityVersion(
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
    const entityVersions = await this.prisma.entityVersion.findMany({
      where: {
        entity: { id: args.data.entity.connect.id }
      },
      orderBy: { versionNumber: 'desc' }
    });
    let lastVersionNumber = entityVersions[0].versionNumber;
    let versionZeroId = entityVersions[Math.abs(entityVersions.length - 1)].id;

    // get entities version zero
    let entityFieldsVersionZero = await this.prisma.entityField.findMany({
      where: {
        entityVersion: { id: versionZeroId }
      }
    });

    //duplicate the field of version 0 - remove the ID and EntityVersionId fields
    let duplicatedFields = entityFieldsVersionZero.map(
      ({ entityVersionId, id, ...keepAttrs }) => keepAttrs
    );

    const newEntityVersion = await this.prisma.entityVersion.create({
      data: {
        label: args.data.label,
        versionNumber: lastVersionNumber + 1,
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
}
