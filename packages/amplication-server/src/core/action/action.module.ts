import { Module } from '@nestjs/common';
import { ExceptionFiltersModule } from 'src/filters/exceptionFilters.module';
import { PrismaModule } from 'nestjs-prisma';
import { GqlAuthModule } from 'src/guards/gql-auth.module';
import { PermissionsModule } from 'src/core/permissions/permissions.module';
import { ActionService } from './action.service';
import { ActionResolver } from './action.resolver';

@Module({
  imports: [
    ExceptionFiltersModule,
    GqlAuthModule,
    PrismaModule,
    PermissionsModule
  ],
  providers: [ActionService, ActionResolver],
  exports: [ActionService, ActionResolver]
})
export class ActionModule {}
