import { Injectable } from '@nestjs/common';
import { Entity, EntityField } from '../../models';
import { PrismaService } from '../../services/prisma.service';
import { UserRoleCreateArgs, FindManyEntityVersionArgs, OrderByArg } from '@prisma/client';

import {
  CreateOneEntityArgs,
  FindManyEntityArgs,
  FindOneArgs,
  UpdateOneEntityArgs
} from '../../dto/args';

@Injectable()
export class EntityService {

  constructor(private readonly prisma: PrismaService) {}
  
  async entity(args: FindOneArgs): Promise<Entity | null> {
    return this.prisma.entity.findOne(args);
  }

  async entities(args: FindManyEntityArgs): Promise<Entity[]> {
    return this.prisma.entity.findMany(args);
  }

  async createOneEntity(args: CreateOneEntityArgs): Promise<Entity> {
    const newEntity = await this.prisma.entity.create(args);
    // Creates first entry on EntityVersion by default when new entity is created
    const newEntityVersion = await this.prisma.entityVersion.create({ 
      data:{
        Label:args.data.name +  " first version",
        versionNumber: 1,
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
       const entityVersions = await this.prisma.entityVersion.findMany({
      where: { 
        entity: {id: entity.id}
        }, orderBy:{versionNumber:OrderByArg.desc}        
    });

    let latestVersion = -1, latestVersionId = "";
    if (entityVersions.length > 0)
    {  
      latestVersion = entityVersions[0].versionNumber;
      latestVersionId = entityVersions[0].id;
    }

    const entityFieldsByLastVersion = await this.prisma.entityField.findMany({
      where: { 
        entityVersion: {id: latestVersionId}
        }, orderBy:{createdAt:OrderByArg.asc}       
    });
    return entityFieldsByLastVersion;
  }
}
