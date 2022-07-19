import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuildContextStorageModule } from './buildContextStorage/buildContextStorage.module';
import { CodeBuildModule } from './codeBuild/codeBuild.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.register([
      {
        name: 'MAIN_KAFKA',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            //TODO: Expose groupId via env
            groupId: 'code-gem-manager-consumer',
          },
        },
      },
    ]),
    CodeBuildModule,
    BuildContextStorageModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
