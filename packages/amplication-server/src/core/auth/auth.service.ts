import { ApolloError } from 'apollo-server-express';
import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserWhereInput } from '@prisma/client';
import { Profile as GitHubProfile } from 'passport-github';
import { AccountService } from '../account/account.service';
import { OrganizationService } from '../organization/organization.service';
import { PasswordService } from '../account/password.service';
import { UserService } from '../user/user.service';
import { ChangePasswordInput, SignupInput } from './dto';

import { Account, User, UserRole, Organization } from 'src/models';
import { PrismaService } from 'nestjs-prisma';

export type AuthUser = User & {
  account: Account;
  organization: Organization;
  userRoles: UserRole[];
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly prismaService: PrismaService,
    private readonly accountService: AccountService,
    private readonly userService: UserService,
    private readonly organizationService: OrganizationService
  ) {}

  async createGitHubUser(
    payload: GitHubProfile,
    email: string
  ): Promise<AuthUser> {
    const account = await this.accountService.createAccount({
      data: {
        email,
        firstName: email,
        lastName: '',
        /** @todo store null */
        password: '',
        githubId: payload.id
      }
    });
    const organization = await this.organizationService.createOrganization(
      account.id,
      {
        data: {
          address: '',
          defaultTimeZone: '',
          name: payload.id
        },
        include: {
          users: {
            include: {
              account: true,
              userRoles: true,
              organization: true
            }
          }
        }
      }
    );
    const [user] = organization.users;

    this.organizationService.generateInitialOrganizationData(user);

    await this.accountService.setCurrentUser(account.id, user.id);
    return user;
  }

  async updateGitHubUser(
    user: AuthUser,
    profile: GitHubProfile
  ): Promise<AuthUser> {
    const account = await this.accountService.updateAccount(user.account.id, {
      githubId: profile.id
    });
    return {
      ...user,
      account
    };
  }

  async signup(payload: SignupInput): Promise<string> {
    const hashedPassword = await this.passwordService.hashPassword(
      payload.password
    );

    try {
      const account = await this.accountService.createAccount({
        data: {
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          password: hashedPassword
          //role: 'USER'
        }
      });

      const organization = await this.organizationService.createOrganization(
        account.id,
        {
          data: {
            address: payload.address,
            defaultTimeZone: payload.defaultTimeZone,
            name: payload.organizationName
          },
          include: {
            users: {
              include: {
                account: true,
                userRoles: true,
                organization: true
              }
            }
          }
        }
      );

      const [user] = organization.users;

      this.organizationService.generateInitialOrganizationData(user);

      await this.accountService.setCurrentUser(account.id, user.id);

      return this.prepareToken(user);
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  async login(email: string, password: string): Promise<string> {
    const account = await this.prismaService.account.findOne({
      where: {
        email
      },
      include: {
        currentUser: {
          include: { organization: true, userRoles: true, account: true }
        }
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

    return this.prepareToken(account.currentUser);
  }

  async setCurrentOrganization(
    accountId: string,
    organizationId: string
  ): Promise<string> {
    const users = (await this.userService.findUsers({
      where: {
        organization: {
          id: organizationId
        },
        account: {
          id: accountId
        }
      },
      include: {
        userRoles: true,
        account: true,
        organization: true
      },
      take: 1
    })) as AuthUser[];

    if (!users.length) {
      throw new ApolloError(
        `This account does not have an active user records in the selected organization or organization not found ${organizationId}`
      );
    }

    const [user] = users;

    await this.accountService.setCurrentUser(accountId, user.id);

    return this.prepareToken(user);
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

  /**
   * Creates a token from given user
   * @param user to create token for
   * @returns new JWT token
   */
  async prepareToken(user: AuthUser): Promise<string> {
    const roles = user.userRoles.map(role => role.role);
    return this.jwtService.sign({
      accountId: user.account.id,
      userId: user.id,
      roles,
      organizationId: user.organization.id
    });
  }

  async getAuthUser(where: UserWhereInput): Promise<AuthUser | null> {
    const matchingUsers = await this.userService.findUsers({
      where,
      include: {
        account: true,
        userRoles: true,
        organization: true
      },
      take: 1
    });
    if (matchingUsers.length === 0) {
      return null;
    }
    const [user] = matchingUsers;
    return user as AuthUser;
  }
}
