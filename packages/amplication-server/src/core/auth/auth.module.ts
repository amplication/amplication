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
import { GoogleSecretsManagerModule } from 'src/services/googleSecretsManager.module';
import { GitHubStrategyConfigService } from './githubStrategyConfig.service';
import { GoogleSecretsManagerService } from 'src/services/googleSecretsManager.service';

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
    UserModule,
    GoogleSecretsManagerModule
  ],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: 'GitHubStrategy',
      useFactory: async (
        authService: AuthService,
        configService: ConfigService,
        googleSecretsManagerService: GoogleSecretsManagerService
      ) => {
        const githubConfigService = new GitHubStrategyConfigService(
          configService,
          googleSecretsManagerService
        );
        const options = await githubConfigService.getOptions();
        if (options === null) {
          return;
        }
        return new GitHubStrategy(authService, options);
      },
      inject: [AuthService, ConfigService, GoogleSecretsManagerService]
    },
    GqlAuthGuard,
    AuthResolver
  ],
  exports: [GqlAuthGuard, AuthService, AuthResolver]
})
export class AuthModule {}
