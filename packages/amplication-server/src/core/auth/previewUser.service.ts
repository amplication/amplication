import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { EnumPreviewAccountType } from "./dto/EnumPreviewAccountType";
import { IdentityProvider, IdentityProviderPreview } from "./auth.types";
import {
  generateRandomEmail,
  generateRandomString,
  validateWorkEmail,
} from "./auth-utils";
import { Account, AuthPreviewAccount, User } from "../../models";
import { AuthUser, BootstrapPreviewUser } from "./types";
import { WorkspaceService } from "../workspace/workspace.service";
import { AccountService } from "../account/account.service";
import { SignupPreviewAccountInput } from "./dto/SignupPreviewAccountInput";
import { EnumTokenType, JwtDto } from "./dto";
import { JwtService } from "@nestjs/jwt";
import { Auth0Service } from "../idp/auth0.service";
import { Auth0User } from "../idp/types";

@Injectable()
export class PreviewUserService {
  constructor(
    @Inject(forwardRef(() => WorkspaceService))
    private readonly workspaceService: WorkspaceService,
    private readonly jwtService: JwtService,
    private readonly accountService: AccountService,
    private readonly auth0Service: Auth0Service
  ) {}

  async signupPreviewAccount({
    previewAccountEmail,
    previewAccountType,
  }: SignupPreviewAccountInput): Promise<AuthPreviewAccount> {
    validateWorkEmail(previewAccountEmail);

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
      resourceId: resource?.id,
    };
  }

  //If automaticallySendResetPasswordEmail is true, we'll send the reset password email, otherwise we'll return the reset password link
  async completeSignupPreviewAccount(
    user: User,
    automaticallySendResetPasswordEmail = true
  ): Promise<string> {
    let auth0User: Auth0User;
    const { account: currentAccount } = user;

    const existingAuth0User = await this.auth0Service.getUserByEmail(
      currentAccount.previewAccountEmail
    );

    if (!existingAuth0User) {
      auth0User = await this.auth0Service.createUser(
        currentAccount.previewAccountEmail
      );
      if (!auth0User?.data?.email)
        throw Error("Failed to create new Auth0 user");
    }

    let results: string;

    if (automaticallySendResetPasswordEmail) {
      const resetPassword = await this.auth0Service.resetUserPassword(
        currentAccount.previewAccountEmail
      );

      if (!resetPassword.data)
        throw Error("Failed to send reset message to new Auth0 user");

      results = resetPassword.data;
    } else {
      results = await this.auth0Service.generateResetUserPasswordLink(
        currentAccount.previewAccountEmail
      );
    }

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

    return results;
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
}
