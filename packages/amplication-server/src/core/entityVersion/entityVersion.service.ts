import { Injectable } from '@nestjs/common';
import { EntityField, EntityVersion } from '../../models';
import { PrismaService } from '../../services/prisma.service';
import { WhereUniqueInput, EntityFieldCreateInput } from '../../dto/inputs';
import { FindOneArgs } from '../../dto/args';
import { FindManyEntityVersionArgs } from '../../dto/args';

import { EntityFieldCreateWithoutEntityVersionInput } from '@prisma/client';

import { CreateOneEntityVersionArgs } from '../../dto/args';

@Injectable()
export class EntityVersionService {
  constructor(private readonly prisma: PrismaService) {}

  async createOneEntityVersion(
    args: CreateOneEntityVersionArgs
  ): Promise<EntityVersion> {
    let a = 1;
    const entityVersions = await this.prisma.entityVersion.findMany({
      where: {
        entity: { id: args.data.entity.connect.id }
      },
      orderBy: { versionNumber: 'desc' }
    });
    let lastVersionNumber = entityVersions[0].versionNumber;
    let versionZeroId = entityVersions[Math.abs(entityVersions.length - 1)].id;
    // get entities version zero
    const entityFieldsVersionZero = await this.prisma.entityField.findMany({
      where: {
        entityVersion: { id: versionZeroId }
      }
    });

    const newEntityVersion = await this.prisma.entityVersion.create({
      data: {
        label: args.data.label,
        versionNumber: lastVersionNumber + 1,
        entity: {
          connect: {
            id: args.data.entity.connect.id
          }
        } //,
        // entityFields:{connect:{id: "ck80350740002o8fpv6ffejjl"}} // single entity field
      }
    });

    //let  fields :Array< EntityFieldCreateWithoutEntityVersionInput>;

    // entityFieldsVersionZero.map(x=>{
    //     ({entityVersion, ...rest}) = x;
    //     return rest;
    // })

    this.prisma.entityVersion.update({
      where: { id: newEntityVersion.id },
      data: {
        entityFields: {
          create: entityFieldsVersionZero
        }
      }
    });

    return newEntityVersion;
  }
}
