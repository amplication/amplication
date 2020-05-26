import { Module } from '@nestjs/common';
import { EntityFieldService } from './entityField.service';
import { PrismaModule } from '../../services/prisma.module';
import { JsonSchemaValidationModule } from '../../services/jsonSchemaValidation.module';

@Module({
  imports: [PrismaModule, JsonSchemaValidationModule],
  providers: [EntityFieldService],
  exports: [EntityFieldService]
})
export class EntityFieldModule {}
