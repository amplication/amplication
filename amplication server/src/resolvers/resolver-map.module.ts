
import { Module } from '@nestjs/common';
//import { RelationsResolversModule} from '../../prisma/dal';

import { ProjectResolver } from './ProjectResolver';
import { OrganizationResolver } from './OrganizationResolver';
import { UserResolver } from './UserResolver';
import { AccountResolver } from './account.resolver';
import { AuthResolver } from './auth.resolver';
import { EntityFieldResolver } from './EntityFieldResolver';
import { EntityResolver } from './EntityResolver';
import { EntityVersionResolver } from './EntityVersionResolver'

import { AccountModule } from '../core/account/account.module'
import { OrganizationModule } from '../core/organization/organization.module'
import { ProjectModule } from '../core/project/project.module'
import { UserModule } from '../core/user/user.module'
import { AuthModule } from '../core/Auth/auth.module';
import { EntityModule } from '../core/entity/entity.module';
import { EntityFieldModule } from '../core/entityField/entityField.module';
import { EntityVersionModule } from '../core/entityVersion/entityVersion.module';
import { PrismaModule } from '../services/prisma.module';
import { ExceptionFiltersModule} from '../filters/exceptionFilters.module';

@Module({
    providers:[
        ProjectResolver,
        OrganizationResolver,
        UserResolver,
        AccountResolver,
        AuthResolver,
        EntityResolver,
        EntityFieldResolver,
        EntityVersionResolver,
    ],
    imports: [
        PrismaModule,
        AccountModule,
        OrganizationModule,
        ProjectModule,
        UserModule,
        AuthModule,
        ExceptionFiltersModule,
        EntityModule,
        EntityFieldModule,
        EntityVersionModule
        //RelationsResolversModule,
    ],
    exports:[
        //RelationsResolversModule,
    ]
})
export class ResovlerMapModule {}
