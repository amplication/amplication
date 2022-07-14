import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CodeBuildModule } from './codeBuild/codeBuild.module';

@Module({
  imports: [
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
