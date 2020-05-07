import { ApolloError } from 'apollo-server-express';
import {
  Injectable,
  BadRequestException,
  ConflictException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { OrganizationService } from './../organization/organization.service';
import { PasswordService } from './../account/password.service';
import { PrismaService } from '../../services/prisma.service';
import { SignupInput } from '../../dto/inputs';
import { Account, User } from '../../models';
import { FindOneAccountArgs, FindOneUserArgs } from '@prisma/client';
import { JwtDto } from './dto/jwt.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService,
    private readonly organizationService: OrganizationService
  ) {}

  async createAccount(payload: SignupInput): Promise<string> {
    const hashedPassword = await this.passwordService.hashPassword(
      payload.password
    );

    try {
      let account: Account = await this.prisma.account.create({
        data: {
          email: payload.email,
          firstName: payload.firstName,
          lastName: payload.lastName,
          password: hashedPassword
          //role: 'USER'
        }
      });

      const org = await this.organizationService.createOrganization(
        account.id,
        {
          data: {
            address: payload.address,
            defaultTimeZone: payload.defaultTimeZone,
            name: payload.organizationName
          }
        }
      );

      return this.prepareToken(payload.email, org.id);
    } catch (error) {
      throw new ConflictException(error);
    }
  }

  async login(email: string, password: string): Promise<string> {
    const accoutArgs: FindOneAccountArgs = {
      where: {
        email
      },
      include: {
        users: {
          include: {
            organization: true,
            userRoles: true
          }
        }
      }
    };

    const account: Account = await this.prisma.account.findOne(accoutArgs);

    if (!account) {
      throw new ApolloError(`No account found for email: ${email}`);
    }

    const passwordValid = await this.passwordService.validatePassword(
      password,
      account.password
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    return this.prepareToken(email, null); //todo: which org id to use
  }

  async setCurrentOrganization(
    accountId: string,
    organizationId: string
  ): Promise<string> {
    const user = await this.prisma.user.findMany({
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

    if (!user || !user.length) {
      throw new BadRequestException(
        `This account does not have an active user records in the selected organization or organization not found ${organizationId}`
      );
    }

    //Set the account's current user
    const account = await this.prisma.account.update({
      data: {
        currentUser: {
          connect: {
            id: user[0].id
          }
        }
      },
      where: {
        id: accountId
      }
    });

    return this.prepareToken(account.email, organizationId);
  }

  async prepareToken(
    accountEmail: string,
    organizationId?: string
  ): Promise<string> {
    let accoutArgs: FindOneAccountArgs;
    if (organizationId) {
      accoutArgs = {
        where: {
          email: accountEmail
        },
        include: {
          users: {
            where: {
              organization: {
                id: organizationId
              }
            },
            include: {
              organization: true,
              userRoles: true
            }
          }
        }
      };
    } else {
      //get all users and use the first one todo: which one to choose
      accoutArgs = {
        where: {
          email: accountEmail
        },
        include: {
          users: {
            include: {
              organization: true,
              userRoles: true
            }
          }
        }
      };
    }

    const account: Account = await this.prisma.account.findOne(accoutArgs);

    const jwt: JwtDto = {
      accountId: account.id
    };

    if (account.users && account.users.length) {
      const user = account.users[0];

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

  validateUser(userId: string): Promise<User> {
    const findArgs: FindOneUserArgs = {
      where: {
        id: userId
      },
      include: {
        account: true,
        userRoles: true,
        organization: true
      }
    };

    return this.prisma.user.findOne(findArgs);
  }

  getAccountFromToken(token: string): Promise<Account> {
    const id = this.jwtService.decode(token)['accountId'];
    return this.prisma.account.findOne({
      where: {
        id
      }
    });
  }
}
