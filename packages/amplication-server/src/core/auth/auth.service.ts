/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable, forwardRef, Inject } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { subDays } from "date-fns";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";
import cuid from "cuid";
import { Env } from "../../env";
import { Prisma, PrismaService } from "../../prisma";
import { Profile as GitHubProfile } from "passport-github2";
import { Account, User, Workspace } from "../../models";
import { AccountService } from "../account/account.service";
import { WorkspaceService } from "../workspace/workspace.service";
import { PasswordService } from "../account/password.service";
import { UserService } from "../user/user.service";
import {
  SignupInput,
  ApiToken,
  CreateApiTokenArgs,
  JwtDto,
  EnumTokenType,
} from "./dto";
import { AmplicationError } from "../../errors/AmplicationError";
import { FindOneArgs } from "../../dto";
import { CompleteInvitationArgs } from "../workspace/dto";
import { AuthProfile, AuthUser, BootstrapPreviewUser } from "./types";
import { AmplicationLogger } from "@amplication/util/nestjs/logging";
import {
  AuthenticationClient,
  ChangePasswordRequest,
  JSONApiResponse,
  ManagementClient,
  SignUpRequest,
  SignUpResponse,
  TextApiResponse,
} from "auth0";
import { SignupPreviewAccountInput } from "./dto/SignupPreviewAccountInput";
import { EnumPreviewAccountType } from "./dto/EnumPreviewAccountType";
import { AuthPreviewAccount } from "../../models/AuthPreviewAccount";
import { PUBLIC_DOMAINS } from "./publicDomains";
import { SignupWithBusinessEmailArgs } from "./dto/SignupWithBusinessEmailArgs";
import {
  generatePassword,
  generateRandomEmail,
  generateRandomString,
} from "./auth-utils";
import { IdentityProvider, IdentityProviderPreview } from "./auth.types";
import { SegmentAnalyticsService } from "../../services/segmentAnalytics/segmentAnalytics.service";
import {
  EnumEventType,
  IdentifyData,
} from "../../services/segmentAnalytics/segmentAnalytics.types";
import { stringifyUrl } from "query-string";

const TOKEN_PREVIEW_LENGTH = 8;
const TOKEN_EXPIRY_DAYS = 30;
const WORK_EMAIL_INVALID = `Email must be a work email address`;

const AUTH_USER_INCLUDE = {
  account: true,
  userRoles: true,
  workspace: true,
};

const WORKSPACE_INCLUDE = {
  users: {
    include: AUTH_USER_INCLUDE,
  },
};

@Injectable()
export class AuthService {
  private readonly auth0: AuthenticationClient;
  private readonly auth0Management: ManagementClient;
  private readonly clientId: string;
  private readonly businessEmailDbConnectionName: string;
  private clientHost: string;

  constructor(
    configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly prismaService: PrismaService,
    private readonly accountService: AccountService,
    private readonly logger: AmplicationLogger,
    private readonly userService: UserService,
    @Inject(forwardRef(() => WorkspaceService))
    private readonly workspaceService: WorkspaceService,
    private readonly analytics: SegmentAnalyticsService
  ) {
    this.clientHost = configService.get(Env.CLIENT_HOST);

    this.clientId = configService.get<string>(Env.AUTH_ISSUER_CLIENT_ID);
    const clientSecret = configService.get<string>(
      Env.AUTH_ISSUER_CLIENT_SECRET
    );
    this.businessEmailDbConnectionName = configService.get<string>(
      Env.AUTH_ISSUER_CLIENT_DB_CONNECTION
    );
    this.auth0 = new AuthenticationClient({
      domain: configService.get<string>(Env.AUTH_ISSUER_BASE_URL),
      clientId: this.clientId,
      clientSecret,
    });
    this.auth0Management = new ManagementClient({
      domain: configService.get<string>(Env.AUTH_ISSUER_MANAGEMENT_BASE_URL),
      clientId: this.clientId,
      clientSecret: clientSecret,
    });
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

    if (!this.isValidWorkEmail(emailAddress)) {
      throw new AmplicationError(WORK_EMAIL_INVALID);
    }

    try {
      const existingAccount = await this.accountService.findAccount({
        where: {
          email: emailAddress,
        },
      });

      let auth0User: JSONApiResponse<SignUpResponse>;

      const existedAuth0User = await this.getAuth0UserByEmail(emailAddress);

      if (!existedAuth0User) {
        auth0User = await this.createAuth0User(emailAddress);

        if (!auth0User.data.email)
          throw Error("Failed to create new Auth0 user");
      }

      const resetPassword = await this.resetAuth0UserPassword(
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

  async createAuth0User(
    email: string
  ): Promise<JSONApiResponse<SignUpResponse>> {
    const data: SignUpRequest = {
      email,
      password: generatePassword(),
      connection: this.businessEmailDbConnectionName,
    };

    const user = await this.auth0.database.signUp(data);

    return user;
  }

  async resetAuth0UserPassword(email: string): Promise<TextApiResponse> {
    const data: ChangePasswordRequest = {
      email,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_id: this.clientId,
      connection: this.businessEmailDbConnectionName,
    };

    const changePasswordResponse = await this.auth0.database.changePassword(
      data
    );

    return changePasswordResponse;
  }

  async getAuth0UserByEmail(email: string): Promise<boolean> {
    const user = await this.auth0Management.usersByEmail.getByEmail({ email });
    if (!user.data.length) return false;

    return user.data[0].email === email;
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
          previewAccountType: EnumPreviewAccountType.None,
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
    data: { githubId?: string; previewAccountType?: EnumPreviewAccountType }
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

  async completeSignupPreviewAccount(user: User): Promise<string> {
    let auth0User: JSONApiResponse<SignUpResponse>;
    const { account: currentAccount } = user;

    const existingAuth0User = await this.getAuth0UserByEmail(
      currentAccount.previewAccountEmail
    );

    if (!existingAuth0User) {
      auth0User = await this.createAuth0User(
        currentAccount.previewAccountEmail
      );
      if (!auth0User?.data?.email)
        throw Error("Failed to create new Auth0 user");
    }

    const resetPassword = await this.resetAuth0UserPassword(
      currentAccount.previewAccountEmail
    );

    if (!resetPassword.data)
      throw Error("Failed to send reset message to new Auth0 user");

    const existingAccount = await this.accountService.findAccount({
      where: {
        email: currentAccount.previewAccountEmail,
      },
    });

    if (!existingAccount) {
      await this.accountService.updateAccount({
        where: { id: currentAccount.id },
        data: {
          // at this stage we only update the email, so in loginOrSignUp we'll have the correct email to find the user
          // and convert the preview account to a regular account with free trial
          email: currentAccount.previewAccountEmail,
        },
      });
    }

    return resetPassword.data;
  }

  private isValidWorkEmail(email: string): boolean {
    const domain = email.split("@")[1];
    return !PUBLIC_DOMAINS.includes(domain);
  }

  async signupPreviewAccount({
    previewAccountEmail,
    previewAccountType,
  }: SignupPreviewAccountInput): Promise<AuthPreviewAccount> {
    if (!this.isValidWorkEmail(previewAccountEmail)) {
      throw new AmplicationError(WORK_EMAIL_INVALID);
    }
    const { signupData, identityProvider } = this.generateDataForPreviewAccount(
      previewAccountEmail,
      previewAccountType
    );

    const account = await this.accountService.createAccount(
      {
        data: signupData,
      },
      { identityProvider }
    );

    const { user, workspaceId, projectId, resourceId } =
      await this.bootstrapPreviewUser(account);

    const token = await this.prepareTokenForPreviewAccount(user);

    return {
      token,
      workspaceId,
      projectId,
      resourceId,
    };
  }

  private generateDataForPreviewAccount(
    previewAccountEmail: string,
    previewAccountType: EnumPreviewAccountType
  ) {
    const identityProvider: IdentityProviderPreview = `${IdentityProvider.PreviewAccount}_${previewAccountType}`;
    return {
      signupData: {
        email: generateRandomEmail(),
        firstName: previewAccountEmail,
        lastName: "",
        password: generateRandomString(),
        previewAccountType,
        previewAccountEmail,
      },
      identityProvider,
    };
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

  private async bootstrapPreviewUser(
    account: Account
  ): Promise<BootstrapPreviewUser> {
    const { workspace, project, resource } =
      await this.workspaceService.createPreviewEnvironment(account);

    const [user] = workspace.users;

    await this.accountService.setCurrentUser(account.id, user.id);

    return {
      user,
      workspaceId: workspace.id,
      projectId: project.id,
      resourceId: resource.id,
    };
  }

  async login(email: string, password: string): Promise<string> {
    const account = await this.prismaService.account.findUnique({
      where: {
        email,
      },
      include: {
        currentUser: {
          include: { workspace: true, userRoles: true, account: true },
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

    return this.prepareToken(account.currentUser);
  }

  async setCurrentWorkspace(
    accountId: string,
    workspaceId: string
  ): Promise<string> {
    const users = (await this.userService.findUsers({
      where: {
        workspace: {
          id: workspaceId,
        },
        account: {
          id: accountId,
        },
      },
      include: {
        userRoles: true,
        account: true,
        workspace: true,
      },
      take: 1,
    })) as AuthUser[];

    if (!users.length) {
      throw new AmplicationError(
        `This account does not have an active user records in the selected workspace or workspace not found ${workspaceId}`
      );
    }

    const [user] = users;

    await this.accountService.setCurrentUser(accountId, user.id);

    return this.prepareToken(user);
  }

  async createApiToken(args: CreateApiTokenArgs): Promise<ApiToken> {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: args.data.user.connect.id,
        deletedAt: null,
      },
      include: { workspace: true, userRoles: true, account: true },
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
    const roles = user.userRoles.map((role) => role.role);

    const payload: JwtDto = {
      accountId: user.account.id,
      userId: user.id,
      roles,
      workspaceId: user.workspace.id,
      type: EnumTokenType.User,
    };
    return this.jwtService.sign(payload);
  }

  async prepareTokenForPreviewAccount(user: AuthUser): Promise<string> {
    const roles = user.userRoles.map((role) => role.role);

    const payload: JwtDto = {
      accountId: user.account.id,
      userId: user.id,
      roles,
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
    const roles = user.userRoles.map((role) => role.role);

    const payload: JwtDto = {
      accountId: user.account.id,
      userId: user.id,
      roles,
      workspaceId: user.workspace.id,
      type: EnumTokenType.ApiToken,
      tokenId: tokenId,
    };

    return this.jwtService.sign(payload);
  }

  async getAuthUser(where: Prisma.UserWhereInput): Promise<AuthUser | null> {
    const matchingUsers = await this.userService.findUsers({
      where,
      include: {
        account: true,
        userRoles: true,
        workspace: true,
      },
      take: 1,
    });
    if (matchingUsers.length === 0) {
      return null;
    }
    const [user] = matchingUsers;
    return user as AuthUser;
  }

  private async createWorkspace(
    name: string,
    account: Account
  ): Promise<Workspace & { users: AuthUser[] }> {
    const workspace = await this.workspaceService.createWorkspace(account.id, {
      data: {
        name,
      },
      include: WORKSPACE_INCLUDE,
    });

    return workspace as unknown as Workspace & { users: AuthUser[] };
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

    const isFromPreviewUser =
      user && user.account.previewAccountType !== EnumPreviewAccountType.None;
    // to complete the preview account signup, after the user reset the password in Auth0 we need to update the account type and workspace subscription
    if (isFromPreviewUser) {
      await this.convertPreviewAccountToRegularAccountWithFreeTrail(user);
      isNew = false;
    } else {
      if (!user) {
        user = await this.createUser(profile);
        isNew = true;
      }

      if (!user.account.githubId || user.account.githubId !== profile.sub) {
        user = await this.updateUser(user, { githubId: profile.sub });
        isNew = false;
      }
    }

    this.trackCompleteEmailSignup(user.account, profile, existingUser);

    await this.configureJtw(response, user, isNew, isFromPreviewUser);
  }

  async convertPreviewAccountToRegularAccountWithFreeTrail(user: User) {
    await this.accountService.updateAccount({
      where: { id: user.account.id },
      data: {
        previewAccountType: EnumPreviewAccountType.None,
      },
    });

    await this.workspaceService.convertPreviewSubscriptionToFreeWithTrial(
      user.workspace.id
    );
  }

  async configureJtw(
    response: Response,
    user: AuthUser,
    isNew: boolean,
    isFromPreviewUser = false
  ): Promise<void> {
    const token = await this.prepareToken(user);
    const url = stringifyUrl({
      url: this.clientHost,
      query: {
        "complete-signup": isNew ? "1" : "0",
        "preview-user-login": isFromPreviewUser ? "1" : "0",
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
