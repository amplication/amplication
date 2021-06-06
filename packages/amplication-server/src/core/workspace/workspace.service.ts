import { Injectable, ConflictException } from '@nestjs/common';
import { Workspace, User } from 'src/models';
import { PrismaService } from 'nestjs-prisma';
import { Prisma } from '@prisma/client';
import {
  FindManyWorkspaceArgs,
  UpdateOneWorkspaceArgs,
  InviteUserArgs
} from './dto';
import { FindOneArgs } from 'src/dto';
import { Role } from 'src/enums/Role';
import { AccountService } from '../account/account.service';
import { PasswordService } from '../account/password.service';
import { AppService } from '../app/app.service';

@Injectable()
export class WorkspaceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accountService: AccountService,
    private readonly passwordService: PasswordService,
    private readonly appService: AppService
  ) {}

  async getWorkspace(args: FindOneArgs): Promise<Workspace | null> {
    return this.prisma.workspace.findUnique(args);
  }

  async getWorkspaces(args: FindManyWorkspaceArgs): Promise<Workspace[]> {
    return this.prisma.workspace.findMany(args);
  }

  async deleteWorkspace(args: FindOneArgs): Promise<Workspace | null> {
    return this.prisma.workspace.delete(args);
  }

  async updateWorkspace(
    args: UpdateOneWorkspaceArgs
  ): Promise<Workspace | null> {
    return this.prisma.workspace.update(args);
  }

  /**
   * Creates a workspace and a user within it for the provided account with workspace admin role
   * @param accountId the account to create the user in the created workspace
   * @param args arguments to pass to workspace creations
   * @returns the created workspace
   */
  async createWorkspace(
    accountId: string,
    args: Prisma.WorkspaceCreateArgs
  ): Promise<Workspace> {
    // Create workspace
    // Create a new user and link it to the account
    // Assign the user an "ORGANIZATION_ADMIN" role
    const workspace = await this.prisma.workspace.create({
      ...args,
      data: {
        ...args.data,
        users: {
          create: {
            account: { connect: { id: accountId } },
            isOwner: true,
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

    return workspace;
  }

  async inviteUser(
    currentUser: User,
    args: InviteUserArgs
  ): Promise<User | null> {
    const { workspace } = currentUser;

    const account = await this.accountService.findAccount({
      where: { email: args.data.email }
    });

    if (account) {
      const existingUsers = await this.prisma.user.findMany({
        where: {
          account: { id: account.id },
          workspace: { id: workspace.id }
        }
      });

      if (existingUsers.length) {
        throw new ConflictException(
          `User with email ${args.data.email} already exist in the workspace.`
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

    //Create a new user record and link it to the account. All user are "Organization admin"
    const user = await this.prisma.user.create({
      data: {
        workspace: { connect: { id: workspace.id } },
        account: { connect: { id: account.id } },
        isOwner: false,
        userRoles: {
          create: {
            role: Role.OrganizationAdmin
          }
        }
      }
    });

    return user;
  }
}
