import { Module } from '@nestjs/common';
import { EntityFieldService } from './entityField.service';
import { EntityFieldResolver } from './EntityFieldResolver';
import { PrismaModule } from '../../services/prisma.module';
import { JsonSchemaValidationModule } from '../../services/jsonSchemaValidation.module';

@Module({
  imports: [PrismaModule, JsonSchemaValidationModule],
  providers: [EntityFieldService, EntityFieldResolver],
  exports: [EntityFieldService, EntityFieldResolver]
})
export class EntityFieldModule {}
