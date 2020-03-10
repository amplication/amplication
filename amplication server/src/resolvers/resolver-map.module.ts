import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
//import { CrudResolversModule, RelationsResolversModule} from '../../prisma/dal';
//import { RelationsResolversModule} from '../../prisma/dal';
import { ProjectResolver } from './project/ProjectResolver';
import {ProjectService} from '../core/project'
import { CoreModule} from '../core/core.module';
import { PrismaService } from '../services/prisma.service';

@Module({
    providers:[
        PrismaService,
        ProjectService,
        ProjectResolver,
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
