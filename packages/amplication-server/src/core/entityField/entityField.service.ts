import {
  Injectable,
  ConflictException,
  NotFoundException
} from '@nestjs/common';
import { EntityField } from '../../models';
import { PrismaService } from '../../services/prisma.service';
import { FindOneArgs } from '../../dto/args';

import {
  CreateOneEntityFieldArgs,
  UpdateOneEntityFieldArgs
} from '../../dto/args';

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

  async updateEntityField(
    args: UpdateOneEntityFieldArgs
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

    if (entityField.entityVersion.versionNumber !== 0) {
      throw new ConflictException(
        `Cannot update fields of previous versions (version ${entityField.entityVersion.versionNumber}) `
      );
    }

    //todo: validate the field was not published -
    //only specific properties of fields that were already published can be updated

    // Set initial field version

    return this.prisma.entityField.update(args);
  }
}
