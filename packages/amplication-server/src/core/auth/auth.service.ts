import { ApolloError } from 'apollo-server-express';
import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AccountService } from '../account/account.service';
import { OrganizationService } from '../organization/organization.service';
import { PasswordService } from '../account/password.service';
import { UserService } from '../user/user.service';
import { SignupInput, ChangePasswordInput } from '../../dto/inputs';
import { Account, User } from '../../models';
import { JwtDto } from './dto/jwt.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly accountService: AccountService,
    private readonly userService: UserService,
    private readonly organizationService: OrganizationService
  ) {}

  async signup(payload: SignupInput): Promise<string> {
    const hashedPassword = await this.passwordService.hashPassword(
      payload.password
    );

    try {
      let account: Account = await this.accountService.createAccount({
        data: {
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          password: hashedPassword
          //role: 'USER'
        }
      });

      await this.organizationService.createOrganization(account.id, {
        data: {
          address: payload.address,
          defaultTimeZone: payload.defaultTimeZone,
          name: payload.organizationName
        }
      });

      return this.prepareToken(account.id, account.currentUser);
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  async login(email: string, password: string): Promise<string> {
    const account: Account = await this.accountService.findAccount({
      where: {
        email
      },
      include: {
        currentUser: { include: { organization: true, userRoles: true } }
      }
    });

    if (!account) {
      throw new ApolloError(`No account found for email: ${email}`);
    }

    const passwordValid = await this.passwordService.validatePassword(
      password,
      account.password
    );

    if (!passwordValid) {
      throw new ApolloError('Invalid password');
    }

    return this.prepareToken(account.id, account.currentUser);
  }

  async setCurrentOrganization(
    accountId: string,
    organizationId: string
  ): Promise<string> {
    const users = await this.userService.findUsers({
      where: {
        organization: {
          id: organizationId
        },
        account: {
          id: accountId
        }
      },
      first: 1
    });

    if (!users.length) {
      throw new ApolloError(
        `This account does not have an active user records in the selected organization or organization not found ${organizationId}`
      );
    }

    const [user] = users;

    await this.accountService.setCurrentUser(accountId, user.id);

    return this.prepareToken(accountId, user);
  }

  /**
   * Creates a token from given accountId and optionally given user
   * @param accountId ID of account to create the token for
   * @param user of the account in an organization
   */
  async prepareToken(accountId: string, user?: User): Promise<string> {
    const jwt: JwtDto = {
      accountId: accountId
    };

    if (user) {
      jwt.userId = user.id;
      jwt.roles = user.userRoles.map(role => role.role);
      jwt.organizationId = user.organization.id;
    } else {
      jwt.userId = null;
      jwt.roles = null;
      jwt.organizationId = null;
    }

    return this.jwtService.sign(jwt);
  }

  async changePassword(
    accountId: string,
    accountPassword: string,
    changePassword: ChangePasswordInput
  ) {
    const passwordValid = await this.passwordService.validatePassword(
      changePassword.oldPassword,
      accountPassword
    );

    if (!passwordValid) {
      throw new ApolloError('Invalid password');
    }

    const hashedPassword = await this.passwordService.hashPassword(
      changePassword.newPassword
    );

    this.accountService.setPassword(accountId, hashedPassword);
  }
}
