/* eslint-disable @typescript-eslint/naming-convention */
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import cuid from "cuid";
import { subDays } from "date-fns";
import { Response } from "express";
import { Profile as GitHubProfile } from "passport-github2";
import { stringifyUrl } from "query-string";
import { FindOneArgs } from "../../dto";
import { Env } from "../../env";
import { AmplicationError } from "../../errors/AmplicationError";
import { Account, User, Workspace } from "../../models";
import { Prisma, PrismaService } from "../../prisma";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import {
  EnumEventType,
  IdentifyData,
} from "../../services/segmentAnalytics/segmentAnalytics.types";
import { AccountService } from "../account/account.service";
import { PasswordService } from "../account/password.service";
import { Auth0Service } from "../idp/auth0.service";
import { Auth0User } from "../idp/types";
import { UserService } from "../user/user.service";
import { CompleteInvitationArgs } from "../workspace/dto";
import { WorkspaceService } from "../workspace/workspace.service";
import { validateWorkEmail } from "./auth-utils";
import { IdentityProvider } from "./auth.types";
import {
  ApiToken,
  CreateApiTokenArgs,
  EnumTokenType,
  JwtDto,
  SignupInput,
} from "./dto";
import { SignupWithBusinessEmailArgs } from "./dto/SignupWithBusinessEmailArgs";
import { AuthProfile, AuthUser } from "./types";
import { Auth0User } from "../idp/types";
import { AwsMarketplaceService } from "../aws-marketplace/aws-marketplace.service";

const TOKEN_PREVIEW_LENGTH = 8;
const TOKEN_EXPIRY_DAYS = 30;

const AUTH_USER_INCLUDE = {
  account: true,
  workspace: true,
};

const WORKSPACE_INCLUDE = {
  users: {
    include: AUTH_USER_INCLUDE,
  },
};

@Injectable()
export class AuthService {
  private clientHost: string;

  constructor(
    configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly prismaService: PrismaService,
    private readonly accountService: AccountService,
    private readonly logger: AmplicationLogger,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    @Inject(forwardRef(() => WorkspaceService))
    private readonly workspaceService: WorkspaceService,
    private readonly analytics: SegmentAnalyticsService,
    private readonly auth0Service: Auth0Service,
    private readonly awsMarketplaceService: AwsMarketplaceService
  ) {
    this.clientHost = configService.get(Env.CLIENT_HOST);
  }

  private async trackStartBusinessEmailSignup(
    emailAddress: string,
    existingAccount: Account | null = null,
    existingUser: IdentityProvider | "No" = "No"
  ) {
    const userData: IdentifyData = {
      accountId: existingAccount?.id, // we use the existing account id if it exists or anonymous id from client if not
      createdAt: existingAccount?.createdAt ?? null,
      email: existingAccount?.email ?? emailAddress,
      firstName: existingAccount?.firstName ?? null,
      lastName: existingAccount?.lastName ?? null,
    };

    await this.analytics.identify(userData);
    await this.analytics.trackManual({
      user: {
        accountId: existingAccount?.id,
      },
      data: {
        event: EnumEventType.StartEmailSignup,
        properties: {
          identityProvider: IdentityProvider.IdentityPlatform,
          existingUser: existingUser,
        },
      },
    });
  }

  trackCompleteEmailSignup(
    account: Account,
    profile: AuthProfile,
    existingUser: boolean
  ): void {
    const { identityOrigin, loginsCount } = profile;

    if (loginsCount != 1) {
      return;
    }

    void this.analytics
      .trackManual({
        user: {
          accountId: account.id,
        },
        data: {
          event: EnumEventType.CompleteEmailSignup,
          properties: {
            identityProvider: IdentityProvider.IdentityPlatform,
            identityOrigin,
            existingUser,
          },
        },
      })
      .catch((error) => {
        this.logger.error(
          `Failed to track complete business email signup for user ${account.id}`,
          error
        );
      });
  }

  async signupWithBusinessEmail(
    args: SignupWithBusinessEmailArgs
  ): Promise<boolean> {
    const emailAddress = args.data.email.toLowerCase();

    validateWorkEmail(emailAddress);

    try {
      const existingAccount = await this.accountService.findAccount({
        where: {
          email: emailAddress,
        },
      });

      let auth0User: Auth0User;

      const existedAuth0User = await this.auth0Service.getUserByEmail(
        emailAddress
      );

      if (!existedAuth0User) {
        auth0User = await this.auth0Service.createUser(emailAddress);

        if (!auth0User.data.email)
          throw Error("Failed to create new Auth0 user");
      }

      const resetPassword = await this.auth0Service.resetUserPassword(
        existedAuth0User ? emailAddress : auth0User.data.email
      );
      if (!resetPassword.data)
        throw Error("Failed to send reset message to new Auth0 user");

      await this.trackStartBusinessEmailSignup(
        emailAddress,
        existingAccount,
        existingAccount
          ? IdentityProvider.GitHub
          : existedAuth0User
          ? IdentityProvider.IdentityPlatform
          : undefined
      );

      return true;
    } catch (error) {
      this.logger.error(error.message, error);
      throw new AmplicationError("Sign up failed, please try again later.");
    }
  }

  async createGitHubUser(
    payload: GitHubProfile,
    email: string
  ): Promise<AuthUser> {
    const account = await this.accountService.createAccount(
      {
        data: {
          email,
          firstName: email,
          lastName: "",
          password: "",
          githubId: payload.id,
        },
      },
      {
        identityProvider: IdentityProvider.GitHub,
      }
    );

    const user = await this.bootstrapUser(account, payload.id);

    return user;
  }

  async updateGitHubUser(
    user: AuthUser,
    profile: GitHubProfile
  ): Promise<AuthUser> {
    const account = await this.accountService.updateAccount({
      where: { id: user.account.id },
      data: {
        githubId: profile.id,
      },
    });
    return {
      ...user,
      account,
    };
  }

  async createUser(profile: AuthProfile): Promise<AuthUser> {
    const account = await this.accountService.createAccount(
      {
        data: {
          email: profile.email,
          firstName: profile.given_name || profile.nickname || profile.email,
          lastName: profile.family_name || "",
          password: "",
          githubId: profile.sub,
        },
      },
      {
        identityProvider: IdentityProvider.IdentityPlatform,
        identityOrigin: profile.identityOrigin,
        identityLoginsCount: profile.loginsCount,
      }
    );

    const user = await this.bootstrapUser(account, profile.email);

    return user;
  }

  async updateUser(
    user: AuthUser,
    data: { githubId?: string }
  ): Promise<AuthUser> {
    const account = await this.accountService.updateAccount({
      where: { id: user.account.id },
      data,
    });
    return {
      ...user,
      account,
    };
  }

  async signup(payload: SignupInput): Promise<string> {
    const hashedPassword = await this.passwordService.hashPassword(
      payload.password
    );

    const account = await this.accountService.createAccount(
      {
        data: {
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          password: hashedPassword,
        },
      },
      { identityProvider: IdentityProvider.Local }
    );

    const user = await this.bootstrapUser(account, payload.workspaceName);

    return this.prepareToken(user);
  }

  private async bootstrapUser(
    account: Account,
    workspaceName: string
  ): Promise<AuthUser> {
    const workspace = await this.createWorkspace(workspaceName, account);
    const [user] = workspace.users;
    await this.accountService.setCurrentUser(account.id, user.id);

    return user;
  }

  async login(email: string, password: string): Promise<string> {
    const account = await this.prismaService.account.findUnique({
      where: {
        email,
      },
      include: {
        currentUser: {
          include: { workspace: true, account: true },
        },
      },
    });

    if (!account) {
      throw new AmplicationError(`No account found for email: ${email}`);
    }

    const passwordValid = await this.passwordService.validatePassword(
      password,
      account.password
    );

    if (!passwordValid) {
      throw new AmplicationError("Invalid password");
    }

    const authUser = await this.getAuthUser({
      id: account.currentUser.id,
    });

    return this.prepareToken(authUser);
  }

  async setCurrentWorkspace(
    accountId: string,
    workspaceId: string
  ): Promise<string> {
    const authUser = await this.getAuthUser({
      workspace: {
        id: workspaceId,
      },
      account: {
        id: accountId,
      },
    });

    if (!authUser) {
      throw new AmplicationError(
        `This account does not have an active user records in the selected workspace or workspace not found ${workspaceId}`
      );
    }

    await this.accountService.setCurrentUser(accountId, authUser.id);

    return this.prepareToken(authUser);
  }

  async createApiToken(args: CreateApiTokenArgs): Promise<ApiToken> {
    const user = await this.getAuthUser({
      id: args.data.user.connect.id,
      deletedAt: null,
    });

    if (!user) {
      throw new AmplicationError(
        `No user found with ID: ${args.data.user.connect.id}`
      );
    }

    const tokenId = cuid();
    const token = await this.prepareApiToken(user, tokenId);
    const previewChars = token.slice(-TOKEN_PREVIEW_LENGTH);
    const hashedToken = await this.passwordService.hashPassword(token);

    const apiToken = await this.prismaService.apiToken.create({
      data: {
        ...args.data,
        id: tokenId,
        lastAccessAt: new Date(),
        previewChars,
        token: hashedToken,
      },
    });

    apiToken.token = token;

    return apiToken;
  }
  /**
   * Validates that the provided token of the provided user exist and not expired.
   * In case it is valid, it updates the "LastAccessAt" with current date and time
   */
  async validateApiToken(args: {
    userId: string;
    tokenId: string;
    token: string;
  }): Promise<boolean> {
    const lastAccessThreshold = subDays(new Date(), TOKEN_EXPIRY_DAYS);

    const apiToken = await this.prismaService.apiToken.updateMany({
      where: {
        userId: args.userId,
        id: args.tokenId,
        lastAccessAt: {
          gt: lastAccessThreshold,
        },
        user: {
          deletedAt: null,
        },
      },
      data: {
        lastAccessAt: new Date(),
      },
    });

    if (apiToken.count === 1) {
      return true;
    }
    return false;
  }

  async deleteApiToken(args: FindOneArgs): Promise<ApiToken> {
    return this.prismaService.apiToken.delete({
      where: {
        id: args.where.id,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        previewChars: true,
        lastAccessAt: true,
        userId: true,
      },
    });
  }

  async getUserApiTokens(args: FindOneArgs): Promise<ApiToken[]> {
    const apiTokens = await this.prismaService.apiToken.findMany({
      where: {
        userId: args.where.id,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
        name: true,
        previewChars: true,
        lastAccessAt: true,
        userId: true,
      },
      orderBy: {
        createdAt: Prisma.SortOrder.desc,
      },
    });

    return apiTokens;
  }

  async changePassword(
    account: Account,
    oldPassword: string,
    newPassword: string
  ): Promise<Account> {
    const passwordValid = await this.passwordService.validatePassword(
      oldPassword,
      account.password
    );

    if (!passwordValid) {
      throw new AmplicationError("Invalid password");
    }

    const hashedPassword = await this.passwordService.hashPassword(newPassword);

    return this.accountService.setPassword(account.id, hashedPassword);
  }

  /**
   * Creates a token from given user
   * @param user to create token for
   * @returns new JWT token
   */
  async prepareToken(user: AuthUser): Promise<string> {
    const payload: JwtDto = {
      accountId: user.account.id,
      userId: user.id,
      roles: [],
      permissions: user.permissions,
      workspaceId: user.workspace.id,
      type: EnumTokenType.User,
    };
    return this.jwtService.sign(payload);
  }

  /**
   * Creates an API token from given user
   * @param user to create token for
   * @returns new JWT token
   */
  async prepareApiToken(user: AuthUser, tokenId: string): Promise<string> {
    const payload: JwtDto = {
      accountId: user.account.id,
      userId: user.id,
      roles: [],
      permissions: user.permissions,
      workspaceId: user.workspace.id,
      type: EnumTokenType.ApiToken,
      tokenId: tokenId,
    };

    return this.jwtService.sign(payload);
  }

  async getAuthUser(where: Prisma.UserWhereInput): Promise<AuthUser | null> {
    return this.userService.getAuthUser(where);
  }

  private async createWorkspace(
    name: string,
    account: Account
  ): Promise<Workspace & { users: AuthUser[] }> {
    const workspace = await this.workspaceService.createWorkspace(
      account.id,
      {
        data: {
          name,
        },
        include: WORKSPACE_INCLUDE,
      },
      true,
      undefined,
      true
    );

    const owner = workspace.users[0];

    return {
      ...workspace,
      users: [
        {
          ...owner,
          account: owner.account,
          workspace: workspace,
          permissions: ["*"], //the first user is the owner of the workspace
        },
      ],
    };
  }

  async loginOrSignUp(profile: AuthProfile, response: Response): Promise<void> {
    let user = await this.getAuthUser({
      account: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        OR: [{ githubId: profile.sub }, { email: profile.email }],
      },
    });

    let isNew: boolean;
    const existingUser = !!user;

    if (!user) {
      user = await this.createUser(profile);
      isNew = true;
    }

    if (!user.account.githubId || user.account.githubId !== profile.sub) {
      user = await this.updateUser(user, { githubId: profile.sub });
      isNew = false;
    }

    await this.awsMarketplaceService.completeAwsMarketplaceIntegration(
      profile.email,
      user.account.id,
      user.workspace.id
    );

    this.trackCompleteEmailSignup(user.account, profile, existingUser);

    await this.configureJtw(response, user, isNew);
  }

  async configureJtw(
    response: Response,
    user: AuthUser,
    isNew: boolean
  ): Promise<void> {
    const token = await this.prepareToken(user);
    const url = stringifyUrl({
      url: this.clientHost,
      query: {
        "complete-signup": isNew ? "1" : "0",
      },
    });
    const clientDomain = new URL(url).hostname;

    const cookieDomainParts = clientDomain.split(".");
    const cookieDomain = cookieDomainParts
      .slice(Math.max(cookieDomainParts.length - 2, 0))
      .join(".");

    response.cookie("AJWT", token, {
      domain: cookieDomain,
      secure: true,
    });
    response.redirect(301, url);
  }

  async completeInvitation(
    currentUser: User,
    args: CompleteInvitationArgs
  ): Promise<string> {
    const workspace = await this.workspaceService.completeInvitation(
      currentUser,
      args
    );

    return this.setCurrentWorkspace(currentUser.account.id, workspace.id);
  }
}
