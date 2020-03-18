
import { Module } from '@nestjs/common';
//import { RelationsResolversModule} from '../../prisma/dal';
<<<<<<< HEAD

import { ProjectResolver } from './ProjectResolver';
import { OrganizationResolver } from './OrganizationResolver';
import { UserResolver } from './UserResolver';
import { AccountResolver } from './account.resolver';
import { AuthResolver } from './auth.resolver';

import { AccountModule } from '../core/account/account.module'
import { OrganizationModule } from '../core/organization/organization.module'
import { ProjectModule } from '../core/project/project.module'
import { UserModule } from '../core/user/user.module'
import { AuthModule } from '../core/Auth/auth.module';
import { PrismaModule } from '../services/prisma.module';
import { ExceptionFiltersModule} from '../filters/exceptionFilters.module';
=======
import { ProjectResolver, OrganizationResolver, UserResolver, EntityResolver, EntityFieldResolver } from './';
import {ProjectService, OrganizationService, UserService, EntityService, EntityFieldService} from '../core'
import { PrismaService } from '../services/prisma.service';
import {  PasswordService } from '../services/password.service';
>>>>>>> 72a6069d573a2c1e8166e24de8b375f4f1cd79ec

@Module({
    providers:[
        ProjectResolver,
        OrganizationResolver,
        UserResolver,
<<<<<<< HEAD
        AccountResolver,
        AuthResolver
=======
        UserService,
        EntityService,
        EntityResolver,
        EntityFieldResolver,
        EntityFieldService
>>>>>>> 72a6069d573a2c1e8166e24de8b375f4f1cd79ec
    ],
    imports: [
        PrismaModule,
        AccountModule,
        OrganizationModule,
        ProjectModule,
        UserModule,
        AuthModule,
        ExceptionFiltersModule,
    //RelationsResolversModule,
    ],
    exports:[
        //AuthModule,
        //RelationsResolversModule,
    ]
})
export class ResovlerMapModule {}
