import { Injectable, ConflictException } from '@nestjs/common';
import { Organization, User } from '../../models';
import { PrismaService } from './../../services/prisma.service';
import { PasswordService } from '../../services/password.service';

import {
  FindManyOrganizationArgs,
  FindOneArgs,
  UpdateOneOrganizationArgs,
  InviteUserArgs
} from '../../dto/args';


@Injectable()
export class OrganizationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService
  ) {}

  async Organization(
    args: FindOneArgs
  ): Promise<Organization | null> {
    return this.prisma.organization.findOne(args);
  }

  async Organizations(args: FindManyOrganizationArgs): Promise<Organization[]> {
    return this.prisma.organization.findMany(args);
  }

  async deleteOrganization(
    args: FindOneArgs
  ): Promise<Organization | null> {
    return this.prisma.organization.delete(args);
  }

  async updateOrganization(
    args: UpdateOneOrganizationArgs
  ): Promise<Organization | null> {
    return this.prisma.organization.update(args);
  }

  async inviteUser(args: InviteUserArgs): Promise<User | null> {
    const organizationId = 'FA90A838-EBFE-4162-9746-22CC9FE49B62'; //todo: get organization Id from user's context

    const account = await this.prisma.account.findOne({
      where: { email: args.data.email }
    });

    if (account) {
      const userExist = await this.prisma.user.findMany({
        where: {
          account: { id: account.id },
          organization: { id: organizationId }
        }
      });

      if (userExist && userExist.length) {
        throw new ConflictException(
          `User with email ${args.data.email} already exist in the organization.`
        );
      }
    }
    if (!account) {
      const hashedPassword = await this.passwordService.hashPassword(
        'generateRandomPassword'
      ); //todo: Generate Random Passowrd

      //Create a new account
      const account = await this.prisma.account.create({
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
        organization: { connect: { id: organizationId } },
        account: { connect: { id: account.id } }
      }
    });

    return user;
  }
}
