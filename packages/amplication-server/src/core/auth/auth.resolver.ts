import { Resolver, Mutation, Query, Args } from '@nestjs/graphql';
import { UseGuards, UseFilters } from '@nestjs/common';
import { Auth, User, Account } from 'src/models';
import {
  LoginArgs,
  SignupArgs,
  ChangePasswordArgs,
  SetCurrentWorkspaceArgs,
  CreateApiTokenArgs,
  ApiToken
} from './dto';

import { AuthService } from './auth.service';
import { GqlResolverExceptionsFilter } from 'src/filters/GqlResolverExceptions.filter';
import { UserEntity } from 'src/decorators/user.decorator';
import { GqlAuthGuard } from 'src/guards/gql-auth.guard';
import { FindOneArgs } from 'src/dto';
import { AuthorizeContext } from 'src/decorators/authorizeContext.decorator';
import { AuthorizableResourceParameter } from 'src/enums/AuthorizableResourceParameter';
@Resolver(() => Auth)
@UseFilters(GqlResolverExceptionsFilter)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async me(@UserEntity() user: User): Promise<User> {
    return user;
  }

  @Mutation(() => Auth)
  async signup(@Args() args: SignupArgs): Promise<Auth> {
    const { data } = args;
    data.email = data.email.toLowerCase();
    const token = await this.authService.signup(data);
    return { token };
  }

  @Mutation(() => Auth)
  async login(@Args() args: LoginArgs): Promise<Auth> {
    const { email, password } = args.data;
    const token = await this.authService.login(email.toLowerCase(), password);
    return { token };
  }

  @Mutation(() => ApiToken)
  @UseGuards(GqlAuthGuard)
  async createApiToken(
    @UserEntity() user: User,
    @Args() args: CreateApiTokenArgs
  ): Promise<ApiToken> {
    args.data.user = {
      connect: {
        id: user.id
      }
    };
    return this.authService.createApiToken(args);
  }

  @Query(() => [ApiToken])
  @UseGuards(GqlAuthGuard)
  async userApiTokens(@UserEntity() user: User): Promise<ApiToken[]> {
    return this.authService.getUserApiTokens({ where: { id: user.id } });
  }

  @Mutation(() => Account)
  @UseGuards(GqlAuthGuard)
  async changePassword(
    @UserEntity() user: User,
    @Args() args: ChangePasswordArgs
  ): Promise<Account> {
    return this.authService.changePassword(
      user.account,
      args.data.oldPassword,
      args.data.newPassword
    );
  }

  @Mutation(() => ApiToken)
  @UseGuards(GqlAuthGuard)
  @AuthorizeContext(AuthorizableResourceParameter.ApiTokenId, 'where.id')
  async deleteApiToken(
    @UserEntity() user: User,
    @Args() args: FindOneArgs
  ): Promise<ApiToken> {
    return this.authService.deleteApiToken(args);
  }

  @Mutation(() => Auth)
  @UseGuards(GqlAuthGuard)
  async setCurrentWorkspace(
    @UserEntity() user: User,
    @Args() args: SetCurrentWorkspaceArgs
  ): Promise<Auth> {
    if (!user.account) {
      throw new Error('User has no account');
    }
    const token = await this.authService.setCurrentWorkspace(
      user.account.id,
      args.data.id
    );
    return { token };
  }
}
