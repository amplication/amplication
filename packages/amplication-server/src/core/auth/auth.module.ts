import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import { AccountModule } from '../account/account.module';
import { PrismaModule } from 'src/services/prisma.module';
import { UserModule } from '../user/user.module';
import { OrganizationModule } from '../organization/organization.module';
import { PermissionsModule } from '../permissions/permissions.module';

import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { JwtStrategy } from './jwt.strategy';
import { GitHubStrategy } from './github.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET')
      }),
      inject: [ConfigService]
    }),
    AccountModule, // (AccountService, PasswordService)
    PrismaModule, // (PrismaService)
    PermissionsModule,
    OrganizationModule,
    UserModule
  ],
  providers: [
    AuthService,
    JwtStrategy,
    GitHubStrategy,
    GqlAuthGuard,
    AuthResolver
  ],
  exports: [GqlAuthGuard, AuthService, AuthResolver]
})
export class AuthModule {}
