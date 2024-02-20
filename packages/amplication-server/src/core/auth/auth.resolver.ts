import { Resolver, Mutation, Query, Args } from "@nestjs/graphql";
import { UseGuards, UseFilters } from "@nestjs/common";
import { Auth, User, Account } from "../../models";
import {
  LoginArgs,
  SignupArgs,
  ChangePasswordArgs,
  SetCurrentWorkspaceArgs,
  CreateApiTokenArgs,
  ApiToken,
} from "./dto";

import { CompleteInvitationArgs } from "../workspace/dto";

import { AuthService } from "./auth.service";
import { GqlResolverExceptionsFilter } from "../../filters/GqlResolverExceptions.filter";
import { UserEntity } from "../../decorators/user.decorator";
import { GqlAuthGuard } from "../../guards/gql-auth.guard";
import { FindOneArgs } from "../../dto";
import { AuthorizeContext } from "../../decorators/authorizeContext.decorator";
import { AuthorizableOriginParameter } from "../../enums/AuthorizableOriginParameter";
import { SignupPreviewAccountArgs } from "./dto/SignupPreviewAccountArgs";
import { AuthPreviewAccount } from "../../models/AuthPreviewAccount";
import { SignupWithBusinessEmailArgs } from "./dto/SignupWithBusinessEmailArgs";

@Resolver(() => Auth)
@UseFilters(GqlResolverExceptionsFilter)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => User)
  @UseGuards(GqlAuthGuard)
  async me(@UserEntity() user: User): Promise<User> {
    return user;
  }

  @Mutation(() => Boolean)
  async signupWithBusinessEmail(
    @Args() args: SignupWithBusinessEmailArgs
  ): Promise<boolean> {
    return this.authService.signupWithBusinessEmail(args);
  }

  @Mutation(() => AuthPreviewAccount)
  async signupPreviewAccount(
    @Args() args: SignupPreviewAccountArgs
  ): Promise<AuthPreviewAccount> {
    const {
      data: { previewAccountEmail, previewAccountType },
    } = args;

    const previewAccountEmailToLower = previewAccountEmail.toLowerCase();

    return this.authService.signupPreviewAccount({
      previewAccountEmail: previewAccountEmailToLower,
      previewAccountType,
    });
  }

  @Mutation(() => String)
  @UseGuards(GqlAuthGuard)
  async completeSignupWithBusinessEmail(
    @UserEntity() user: User
  ): Promise<string> {
    return this.authService.completeSignupPreviewAccount(user);
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
        id: user.id,
      },
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
  @AuthorizeContext(AuthorizableOriginParameter.ApiTokenId, "where.id")
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
      throw new Error("User has no account");
    }
    const token = await this.authService.setCurrentWorkspace(
      user.account.id,
      args.data.id
    );
    return { token };
  }

  @Mutation(() => Auth)
  @UseGuards(GqlAuthGuard)
  async completeInvitation(
    @UserEntity() user: User,
    @Args() args: CompleteInvitationArgs
  ): Promise<Auth> {
    if (!user.account) {
      throw new Error("User has no account");
    }
    const token = await this.authService.completeInvitation(user, args);
    return { token };
  }
}
