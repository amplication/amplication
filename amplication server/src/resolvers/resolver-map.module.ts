
import { Module } from '@nestjs/common';
//import { RelationsResolversModule} from '../../prisma/dal';

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
import { PrismaModule } from '../services/prisma.module'

@Module({
    providers:[
        ProjectResolver,
        OrganizationResolver,
        UserResolver,
        AccountResolver,
        AuthResolver
    ],
    imports: [
        PrismaModule,
        AccountModule,
        OrganizationModule,
        ProjectModule,
        UserModule,
        AuthModule
        //RelationsResolversModule,
    ],
    exports:[
        //AuthModule,
        //RelationsResolversModule,
    ]
})
export class ResovlerMapModule {}
