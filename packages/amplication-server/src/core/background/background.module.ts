import { Module, HttpModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { BackgroundService } from './background.service';
import { BackgroundAuthGuard } from './background-auth.guard';
import { BackgroundJwtStrategy } from './background-jwt.strategy';

@Module({
  imports: [HttpModule, JwtModule.register({})],
  providers: [BackgroundService, BackgroundAuthGuard, BackgroundJwtStrategy],
  exports: [BackgroundService, BackgroundAuthGuard, BackgroundJwtStrategy]
})
export class BackgroundModule {}
