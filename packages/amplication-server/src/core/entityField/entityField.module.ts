import { Module } from '@nestjs/common';
import { EntityFieldService } from './entityField.service';
import { EntityFieldResolver } from './EntityFieldResolver';
import { PrismaModule } from 'src/services/prisma.module';
import { JsonSchemaValidationModule } from 'src/services/jsonSchemaValidation.module';

@Module({
  imports: [PrismaModule, JsonSchemaValidationModule],
  providers: [EntityFieldService, EntityFieldResolver],
  exports: [EntityFieldService, EntityFieldResolver]
})
export class EntityFieldModule {}
