import { AccountModule } from '../account/account.module'
import { PrismaModule } from '../../services/prisma.module';
import { OrganizationModule } from '../organization/organization.module';

import { GqlAuthGuard } from '../../guards/gql-auth.guard';
import { AuthService } from './auth.service';
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
    }),
    AccountModule, //(PasswordService)
    PrismaModule, // (PrismaService)
    OrganizationModule
  ],
  providers: [
    AuthService,
    JwtStrategy,
    GqlAuthGuard
  ],
  exports: [
    GqlAuthGuard,
    AuthService,]
})
export class AuthModule {}
