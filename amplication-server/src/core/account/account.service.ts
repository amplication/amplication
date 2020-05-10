import { Injectable, BadRequestException } from '@nestjs/common';
import { PasswordService } from './password.service';
import { PrismaService } from '../../services/prisma.service';
import { ChangePasswordInput, UpdateAccountInput } from '../../dto/inputs';
import { ApolloError } from 'apollo-server-express';

@Injectable()
export class AccountService {
  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService
  ) {}

  updateAccount(accountId: string, newAccountData: UpdateAccountInput) {
    return this.prisma.account.update({
      data: newAccountData,
      where: {
        id: accountId
      }
    });
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

    return this.prisma.account.update({
      data: {
        password: hashedPassword
      },
      where: { id: accountId }
    });
  }
}
