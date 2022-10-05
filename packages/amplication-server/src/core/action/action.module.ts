import { Module } from '@nestjs/common';
import { ExceptionFiltersModule } from '../../filters/exceptionFilters.module';
import { PrismaModule } from '@amplication/prisma-db';
import { GqlAuthModule } from '../../guards/gql-auth.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { ActionService } from './action.service';
import { ActionResolver } from './action.resolver';

@Module({
  imports: [
    ConfigService,
    ExceptionFiltersModule,
    GqlAuthModule,
    PrismaModule,
    PermissionsModule
  ],
  providers: [ActionService, ActionResolver],
  exports: [ActionService, ActionResolver]
})
export class ActionModule {}
