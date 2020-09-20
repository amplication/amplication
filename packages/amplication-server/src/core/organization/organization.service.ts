import { Injectable, ConflictException } from '@nestjs/common';
import { Organization, User } from 'src/models';
import { PrismaService } from 'nestjs-prisma';
import {
  FindManyOrganizationArgs,
  UpdateOneOrganizationArgs,
  InviteUserArgs
} from './dto';
import { FindOneArgs } from 'src/dto';
import { Role } from 'src/enums/Role';
import { AccountService } from '../account/account.service';
import { PasswordService } from '../account/password.service';
import { OrganizationCreateArgs, Subset } from '@prisma/client';
import { AppService } from '../app/app.service';
import { EntityService } from '../entity/entity.service';

import {
  INITIAL_APP_ENTITIES,
  INITIAL_APP_COMMIT_MESSAGE
} from './initialAppData';

const INITIAL_APP_DATA = {
  description: 'Sample App for task management',
  name: 'My sample app'
};

@Injectable()
export class OrganizationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accountService: AccountService,
    private readonly passwordService: PasswordService,
    private readonly appService: AppService,
    private readonly entityService: EntityService
  ) {}

  async generateInitialOrganizationData(user: User) {
    //generate sample app
    const app = await this.appService.createApp(
      {
        data: INITIAL_APP_DATA
      },
      user
    );

    await this.entityService.bulkCreateEntities(
      app.id,
      user,
      INITIAL_APP_ENTITIES
    );

    await this.appService.commit({
      data: {
        app: {
          connect: {
            id: app.id
          }
        },
        message: INITIAL_APP_COMMIT_MESSAGE,
        user: {
          connect: {
            id: user.id
          }
        }
      }
    });
  }

  async getOrganization(args: FindOneArgs): Promise<Organization | null> {
    return this.prisma.organization.findOne(args);
  }

  async getOrganizations(
    args: FindManyOrganizationArgs
  ): Promise<Organization[]> {
    return this.prisma.organization.findMany(args);
  }

  async deleteOrganization(args: FindOneArgs): Promise<Organization | null> {
    return this.prisma.organization.delete(args);
  }

  async updateOrganization(
    args: UpdateOneOrganizationArgs
  ): Promise<Organization | null> {
    return this.prisma.organization.update(args);
  }

  ///This function should be called when a new account register for the service, or when an existing account creates a new organization
  ///The account is automatically linked with the new organization with a new user record in role "Organization Admin"
  createOrganization<T extends OrganizationCreateArgs>(
    accountId: string,
    args: Subset<T, OrganizationCreateArgs>
  ) {
    //Create organization
    //Create a new user record and link it to the account
    //Assign the user an "ORGANIZATION_ADMIN" role
    return this.prisma.organization.create<T>({
      ...args,
      data: {
        ...args.data,
        users: {
          create: {
            account: { connect: { id: accountId } },
            userRoles: {
              create: {
                role: Role.OrganizationAdmin
              }
            }
          }
        }
      }
    });
  }

  async inviteUser(
    currentUser: User,
    args: InviteUserArgs
  ): Promise<User | null> {
    const { organization } = currentUser;

    const account = await this.accountService.findAccount({
      where: { email: args.data.email }
    });

    if (account) {
      const existingUsers = await this.prisma.user.findMany({
        where: {
          account: { id: account.id },
          organization: { id: organization.id }
        }
      });

      if (existingUsers.length) {
        throw new ConflictException(
          `User with email ${args.data.email} already exist in the organization.`
        );
      }
    }
    if (!account) {
      const password = this.passwordService.generatePassword();
      const hashedPassword = await this.passwordService.hashPassword(password);

      return this.accountService.createAccount({
        data: {
          firstName: '',
          lastName: '',
          email: args.data.email,
          password: hashedPassword
        }
      });
    }

    //Create a new user record and link it to the account
    const user = await this.prisma.user.create({
      data: {
        organization: { connect: { id: organization.id } },
        account: { connect: { id: account.id } }
      }
    });

    return user;
  }
}
