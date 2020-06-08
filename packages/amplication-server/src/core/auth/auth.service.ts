import { ApolloError } from 'apollo-server-express';
import { Injectable, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AccountService } from '../account/account.service';
import { OrganizationService } from '../organization/organization.service';
import { PasswordService } from '../account/password.service';
import { UserService } from '../user/user.service';
import { ChangePasswordInput, SignupInput } from './dto';

import { User } from 'src/models';
import { JwtDto } from './dto/jwt.dto';
import { UserRole } from '@prisma/client';
import { PrismaService } from 'src/services/prisma.service';

type UserWithRoles = User & {
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

  async signup(payload: SignupInput): Promise<string> {
    const hashedPassword = await this.passwordService.hashPassword(
      payload.password
    );

    try {
      let account = await this.accountService.createAccount({
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
          }
        }
      );

      const [user] = organization.users;

      await this.accountService.setCurrentUser(account.id, user.id);

      return this.prepareToken(account.id, user, organization.id);
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

    return this.prepareToken(
      account.id,
      account?.currentUser,
      account?.currentUser?.organization.id
    );
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
        userRoles: true
      },
      take: 1
    })) as UserWithRoles[];

    if (!users.length) {
      throw new ApolloError(
        `This account does not have an active user records in the selected organization or organization not found ${organizationId}`
      );
    }

    const [user] = users;

    await this.accountService.setCurrentUser(accountId, user.id);

    return this.prepareToken(accountId, user, organizationId);
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
   * Creates a token from given accountId and optionally given user
   * @param accountId ID of account to create the token for
   * @param user of the account in an organization
   */
  private async prepareToken(
    accountId: string,
    user?: UserWithRoles,
    organizationId?: string
  ): Promise<string> {
    const jwt: JwtDto = {
      accountId: accountId
    };

    if (user) {
      jwt.userId = user.id;
      jwt.roles = user.userRoles.map(role => role.role);
      jwt.organizationId = organizationId;
    } else {
      jwt.userId = null;
      jwt.roles = null;
      jwt.organizationId = null;
    }

    return this.jwtService.sign(jwt);
  }
}
