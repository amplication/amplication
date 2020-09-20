import { Module, HttpModule } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { BackgroundService } from './background.service';
import { BackgroundAuthGuard } from './background-auth.guard';
import { BackgroundJwtStrategy, SECRET_VAR } from './background-jwt.strategy';

@Module({
  imports: [
    HttpModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get(SECRET_VAR)
      }),
      inject: [ConfigService]
    })
  ],
  providers: [BackgroundService, BackgroundAuthGuard, BackgroundJwtStrategy],
  exports: [BackgroundService, BackgroundAuthGuard, BackgroundJwtStrategy]
})
export class BackgroundModule {}
