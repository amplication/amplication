import { Injectable } from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PasswordService {
  get bcryptSaltRounds(): string | number {
    const saltOrRounds = this.configService.get<number>(
      'BCRYPT_SALT_OR_ROUNDS'
    );

    return Number.isInteger(Number(saltOrRounds))
      ? Number(saltOrRounds)
      : saltOrRounds;
  }

  constructor(private configService: ConfigService) {}

  validatePassword(password: string, hashedPassword: string): Promise<boolean> {
    return compare(password, hashedPassword);
  }

  hashPassword(password: string): Promise<string> {
    return hash(password, this.bcryptSaltRounds);
  }
}
