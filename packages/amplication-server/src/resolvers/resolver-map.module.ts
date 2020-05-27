import { Module } from '@nestjs/common';
//import { RelationsResolversModule} from '../../prisma/dal';

import { OrganizationResolver } from './OrganizationResolver';
import { UserResolver } from './userResolver';

import { EntityFieldResolver } from './EntityFieldResolver';
import { EntityResolver } from './EntityResolver';
import { EntityVersionResolver } from './EntityVersionResolver';

import { PrismaModule } from '../services/prisma.module';
import { ExceptionFiltersModule } from '../filters/exceptionFilters.module';
import { CoreModule } from '../core/core.module';

@Module({
  providers: [
    OrganizationResolver,
    UserResolver,
    EntityResolver,
    EntityFieldResolver,
    EntityVersionResolver
  ],
  imports: [PrismaModule, ExceptionFiltersModule, CoreModule],
  exports: []
})
export class ResovlerMapModule {}
