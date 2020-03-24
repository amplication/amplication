
import { Module } from '@nestjs/common';
//import { RelationsResolversModule} from '../../prisma/dal';

import { ProjectResolver } from './ProjectResolver';
import { OrganizationResolver } from './OrganizationResolver';
import { UserResolver } from './UserResolver';
import { AccountResolver } from './account.resolver';
import { AuthResolver } from './auth.resolver';
import { EntityFieldResolver } from './EntityFieldResolver';
import { EntityResolver } from './EntityResolver';

import { PrismaModule } from '../services/prisma.module';
import { ExceptionFiltersModule} from '../filters/exceptionFilters.module';
import { CoreModule} from '../core/core.module';


@Module({
    providers:[
        ProjectResolver,
        OrganizationResolver,
        UserResolver,
        AccountResolver,
        AuthResolver,
        EntityResolver,
        EntityFieldResolver
    ],
    imports: [
        PrismaModule,
        ExceptionFiltersModule,
        CoreModule,
    ],
    exports:[
    ]
})
export class ResovlerMapModule {}
