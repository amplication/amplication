import { Injectable, ConflictException } from '@nestjs/common';
import { Workspace, User } from 'src/models';
import { Invitation } from './dto/Invitation';
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
  ): Promise<Invitation | null> {
    const { workspace, id: currentUserId } = currentUser;

    const existingUsers = await this.prisma.user.findMany({
      where: {
        account: { email: args.data.email },
        workspace: { id: workspace.id }
      }
    });

    if (existingUsers.length) {
      throw new ConflictException(
        `User with email ${args.data.email} already exist in the workspace.`
      );
    }

    const existingInvitation = this.prisma.invitation.findUnique({
      where: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        workspaceId_email: {
          email: args.data.email,
          workspaceId: workspace.id
        }
      }
    });

    if (existingInvitation) {
      throw new ConflictException(
        `Invitation with email ${args.data.email} already exist in the workspace.`
      );
    }

    const invitation = await this.prisma.invitation.create({
      data: {
        email: args.data.email,
        workspace: {
          connect: {
            id: workspace.id
          }
        },
        invitedByUser: {
          connect: {
            id: currentUserId
          }
        }
      }
    });

    /**@todo: send email */

    return invitation;
  }
}
