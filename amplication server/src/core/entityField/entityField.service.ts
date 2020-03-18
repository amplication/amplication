import { Injectable } from '@nestjs/common';
import { EntityField } from '../../models';
import { PrismaService } from '../../services/prisma.service';
import { WhereUniqueInput } from '../../dto/inputs';
import { FindOneArgs } from '../../dto/args';

import {
    CreateOneEntityFieldArgs,
  
} from '../../dto/args';

@Injectable()
export class EntityFieldService {
  constructor(
    private readonly prisma: PrismaService) {}

    async entityField(args: FindOneArgs): Promise<EntityField | null> {
      return this.prisma.entityField.findOne(args);
    }
  
    // async entityFields(@Context() ctx: any, @Args() args: FindManyEntityFieldArgs): Promise<EntityField[]> {
    //   return ctx.prisma.entityField.findMany(args);
    // }
    
    async createEntityField(args: CreateOneEntityFieldArgs): Promise<EntityField> {

      let a = 1; 
      const entityVersions = await this.prisma.entityVersion.findMany({
        where: {
          entity: {id: args.where.connect.id}
          }, orderBy:{ versionNumber:"desc"}       
      });
  
      let latestVersion = -1, latestVersionId = "";
      if (entityVersions.length > 0)
      {  
        latestVersion = entityVersions[0].versionNumber; 
        latestVersionId = entityVersions[0].id;
      } 
      args.data.entityVersion ={connect :{ 
        id: latestVersionId
      }}
      //const data1 = {EntityField, ...args.data};  

      return this.prisma.entityField.create({data:args.data});
    }
}
