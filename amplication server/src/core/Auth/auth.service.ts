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
import { Account, User } from '../../models';
import {  FindOneAccountArgs, FindOneUserArgs } from '@prisma/client'
import { JwtDto} from '../../resolvers/auth/dto/jwt.dto'


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

    const accoutArgs : FindOneAccountArgs = {
      where : {
        email
      },
      include : {
        users : {
          include:{
            organization:true,
            userRoles:true
          }
        }
      }
    }

    const account :Account = await this.prisma.account.findOne(accoutArgs);

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

    const jwt : JwtDto = {
      accountId: account.id
    }

    if (account.users && account.users.length){
      const user = account.users[0];

      jwt.userId = user.id;
      jwt.roles = user.userRoles.map(role=> role.role);
      jwt.organizationId = user.organization.id;
    }else{
      jwt.userId = null;
      jwt.roles = null;
      jwt.organizationId = null;
    }


    return this.jwtService.sign(jwt);
  }

  validateUser(userId: string): Promise<User> {
    const findArgs : FindOneUserArgs = {
      where:{
        id:userId
      },
      include:{
        account:true,
        userRoles:true,
        organization:true,
      }
    }

    return this.prisma.user.findOne(findArgs);
  }

  getAccountFromToken(token: string): Promise<Account> {
    const id = this.jwtService.decode(token)['accountId'];
    return this.prisma.account.findOne({ where: { id } });
  }
}
