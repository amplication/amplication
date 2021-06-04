import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AccountModule } from '../account/account.module';
import { PrismaModule } from 'nestjs-prisma';
import { UserModule } from '../user/user.module';
import { WorkspaceModule } from '../workspace/workspace.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { ExceptionFiltersModule } from 'src/filters/exceptionFilters.module';

import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { GitHubStrategy } from './github.strategy';
import { GoogleSecretsManagerModule } from 'src/services/googleSecretsManager.module';
import { GitHubStrategyConfigService } from './githubStrategyConfig.service';
import { GoogleSecretsManagerService } from 'src/services/googleSecretsManager.service';

@Module({
  imports: [
    ConfigModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET')
      }),
      inject: [ConfigService]
    }),
    AccountModule, // (AccountService, PasswordService)
    PrismaModule, // (PrismaService)
    PermissionsModule,
    ExceptionFiltersModule,
    WorkspaceModule,
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
    AuthResolver,
    GitHubStrategyConfigService
  ],
  controllers: [AuthController],
  exports: [GqlAuthGuard, AuthService, AuthResolver]
})
export class AuthModule {}
