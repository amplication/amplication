import { Module } from '@nestjs/common';
import { EntityFieldService } from './entityField.service';
import { EntityFieldResolver } from './entityField.resolver';
import { PrismaModule } from 'src/services/prisma.module';
import { JsonSchemaValidationModule } from 'src/services/jsonSchemaValidation.module';
import { EntityModule } from 'src/core/entity/entity.module';

@Module({
  imports: [PrismaModule, JsonSchemaValidationModule, EntityModule],
  providers: [EntityFieldService, EntityFieldResolver],
  exports: [EntityFieldService, EntityFieldResolver]
})
export class EntityFieldModule {}
