import { Injectable, ConflictException } from '@nestjs/common';
import { Organization, User } from 'src/models';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';
import {
  FindManyOrganizationArgs,
  UpdateOneOrganizationArgs,
  InviteUserArgs
} from './dto';
import { FindOneArgs } from 'src/dto';
import { Role } from 'src/enums/Role';
import { AccountService } from '../account/account.service';
import { PasswordService } from '../account/password.service';
import { AppService } from '../app/app.service';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accountService: AccountService,
    private readonly passwordService: PasswordService,
    private readonly appService: AppService
  ) {}

  async getOrganization(args: FindOneArgs): Promise<Organization | null> {
    return this.prisma.organization.findUnique(args);
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

  /**
   * Creates an organization and a user within it for the provided account with organization admin role
   * @param accountId the account to create the user in the created organization
   * @param args arguments to pass to organization creations
   * @returns the created organization
   */
  async createOrganization(
    accountId: string,
    args: Prisma.OrganizationCreateArgs
  ) {
    // Create organization
    // Create a new user and link it to the account
    // Assign the user an "ORGANIZATION_ADMIN" role
    const organization = await this.prisma.organization.create({
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
      },
      include: {
        ...args.include,
        // Include users by default, allow to bypass it for including additional user links
        users: args?.include?.users || true
      }
    });
    const [user] = organization.users;
    await this.appService.createSampleApp(user);
    return organization;
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
