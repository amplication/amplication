import {
  Injectable,
  ConflictException,
  forwardRef,
  Inject
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserWhereInput } from '@prisma/client';
import { Profile as GitHubProfile } from 'passport-github2';
import { PrismaService } from 'nestjs-prisma';
import { Account, User, UserRole, Organization } from 'src/models';
import { AccountService } from '../account/account.service';
import { OrganizationService } from '../organization/organization.service';
import { PasswordService } from '../account/password.service';
import { UserService } from '../user/user.service';
import { SignupInput } from './dto';
import { AmplicationError } from 'src/errors/AmplicationError';

export type AuthUser = User & {
  account: Account;
  organization: Organization;
  userRoles: UserRole[];
};

const ORGANIZATION_DEFAULT_VALUES = {
  address: '',
  defaultTimeZone: ''
};

const AUTH_USER_INCLUDE = {
  account: true,
  userRoles: true,
  organization: true
};

const ORGANIZATION_INCLUDE = {
  users: {
    include: AUTH_USER_INCLUDE
  }
};

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly passwordService: PasswordService,
    private readonly prismaService: PrismaService,
    private readonly accountService: AccountService,
    private readonly userService: UserService,
    @Inject(forwardRef(() => OrganizationService))
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

    const organization = await this.createOrganization(payload.id, account);
    const [user] = organization.users;

    await this.accountService.setCurrentUser(account.id, user.id);

    return user;
  }

  async updateGitHubUser(
    user: AuthUser,
    profile: GitHubProfile
  ): Promise<AuthUser> {
    const account = await this.accountService.updateAccount({
      where: { id: user.account.id },
      data: {
        githubId: profile.id
      }
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

      const organization = await this.createOrganization(
        payload.organizationName,
        account
      );

      const [user] = organization.users;

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
      throw new AmplicationError(`No account found for email: ${email}`);
    }

    const passwordValid = await this.passwordService.validatePassword(
      password,
      account.password
    );

    if (!passwordValid) {
      throw new AmplicationError('Invalid password');
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
      throw new AmplicationError(
        `This account does not have an active user records in the selected organization or organization not found ${organizationId}`
      );
    }

    const [user] = users;

    await this.accountService.setCurrentUser(accountId, user.id);

    return this.prepareToken(user);
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
      throw new AmplicationError('Invalid password');
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

  private async createOrganization(
    name: string,
    account: Account
  ): Promise<Organization & { users: AuthUser[] }> {
    const organization = await this.organizationService.createOrganization(
      account.id,
      {
        data: {
          ...ORGANIZATION_DEFAULT_VALUES,
          name
        },
        include: ORGANIZATION_INCLUDE
      }
    );
    return (organization as unknown) as Organization & { users: AuthUser[] };
  }
}
