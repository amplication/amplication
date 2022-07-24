import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BuildContextStorageModule } from './buildContextStorage/buildContextStorage.module';
import { CodeBuildModule } from './codeBuild/codeBuild.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.registerAsync([
      {
        name: 'kafkaModule',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => {
          return {
            name: 'MAIN_KAFKA',
            transport: Transport.KAFKA,
            options: {
              client: {
                brokers: configService.get<string[]>('KAFKA_BROKERS'),
              },
              consumer: {
                groupId: configService.get<string>('KAFKA_GROUP_ID'),
              },
            },
          };
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
