import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CrudResolversModule, RelationsResolversModule} from '../../prisma/dal';


@Module({
    providers:[
    ],
    imports: [
        AuthModule,
        CrudResolversModule, 
        RelationsResolversModule
    ],
    exports:[
        AuthModule,
        CrudResolversModule, 
        RelationsResolversModule
    ]
})
export class ResovlerMapModule {}
