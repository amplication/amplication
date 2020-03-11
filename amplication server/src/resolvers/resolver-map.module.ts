import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
//import { RelationsResolversModule} from '../../prisma/dal';
import { ProjectResolver, OrganizationResolver } from './';
import {ProjectService, OrganizationService} from '../core'
import { PrismaService } from '../services/prisma.service';

@Module({
    providers:[
        PrismaService,
        ProjectService,
        ProjectResolver,
        OrganizationService,
        OrganizationResolver,

    ],
    imports: [
        AuthModule,
        //RelationsResolversModule,
    ],
    exports:[
        AuthModule,
        //RelationsResolversModule,
        ProjectResolver
    ]
})
export class ResovlerMapModule {}
