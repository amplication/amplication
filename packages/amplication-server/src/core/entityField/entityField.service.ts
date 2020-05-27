import { Injectable, ConflictException } from '@nestjs/common';
import { EntityField } from '../../models';
import { PrismaService } from '../../services/prisma.service';
import { FindOneArgs } from '../../dto/args';

import { CreateOneEntityFieldArgs } from './dto';

const INITIAL_VERSION_NUMBER = 0;

@Injectable()
export class EntityFieldService {
  constructor(private readonly prisma: PrismaService) {}

  async entityField(args: FindOneArgs): Promise<EntityField | null> {
    return this.prisma.entityField.findOne(args);
  }

  // async entityFields(@Context() ctx: any, @Args() args: FindManyEntityFieldArgs): Promise<EntityField[]> {
  //   return ctx.prisma.entityField.findMany(args);
  // }

  async createEntityField(
    args: CreateOneEntityFieldArgs
  ): Promise<EntityField> {
    // Set initial field version
    const entityVersions = await this.prisma.entityVersion.findMany({
      where: {
        entity: { id: args.data.entity.connect.id },
        versionNumber: INITIAL_VERSION_NUMBER
      }
    });

    let currentVersionId = '';
    if (entityVersions.length > 0) {
      currentVersionId = entityVersions[0].id;
    } else {
      throw new ConflictException(
        "Can't find the current version for the requested entity"
      );
    }
    args.data.entityVersion = {
      connect: {
        id: currentVersionId
      }
    };
    let entity, data;

    ({ entity, ...data } = args.data);

    return this.prisma.entityField.create({ data: data });
  }
}
