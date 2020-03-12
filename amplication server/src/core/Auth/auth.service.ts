import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {  PasswordService } from '../../services/password.service';
import { PrismaService } from '../../services/prisma.service';
import { SignupInput } from '../../resolvers/auth/dto/signup.input';
import { Account } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly passwordService: PasswordService
  ) {}

  async createAccount(payload: SignupInput): Promise<string> {
    const hashedPassword = await this.passwordService.hashPassword(
      payload.password
    );

    try {
      const account = await this.prisma.account.create({
        data: {
          ...payload,
          password: hashedPassword,
          //role: 'USER'
        }
      });

      return this.jwtService.sign({ userId: account.id });
    } catch (error) {
      throw new ConflictException(`Email ${payload.email} already used.`);
    }
  }

  async login(email: string, password: string): Promise<string> {
    const account = await this.prisma.account.findOne({ where: { email } });

    if (account === null) {
      throw new NotFoundException(`No account found for email: ${email}`);
    }

    const passwordValid = await this.passwordService.validatePassword(
      password,
      account.password
    );

    if (!passwordValid) {
      throw new BadRequestException('Invalid password');
    }

    return this.jwtService.sign({ userId: account.id });
  }

  validateAccount(userId: string): Promise<Account> {
    return this.prisma.account.findOne({ where: { id: userId } });
  }

  getAccountFromToken(token: string): Promise<Account> {
    const id = this.jwtService.decode(token)['userId'];
    return this.prisma.account.findOne({ where: { id } });
  }
}
