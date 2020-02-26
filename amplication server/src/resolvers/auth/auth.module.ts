import { PrismaService } from './../../services/prisma.service';
import { PasswordService } from './../../services/password.service';
import { GqlAuthGuard } from '../../guards/gql-auth.guard';
import { AuthService } from '../../services/auth.service';
import { AuthResolver } from './auth.resolver';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET')
      }),
      inject: [ConfigService]
    })
  ],
  providers: [
    AuthService,
    AuthResolver,
    JwtStrategy,
    GqlAuthGuard,
    PasswordService,
    PrismaService
  ],
  exports: [GqlAuthGuard]
})
export class AuthModule {}
