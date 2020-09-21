import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JsonValue } from 'type-fest';
import { SECRET_VAR } from './background-jwt.strategy';

const HOST_VAR = 'HOST';
/** @see https://github.com/vercel/ms */
const EXPIRES_IN = '3h';

@Injectable()
export class BackgroundService {
  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}
  async queue(path: string, payload: JsonValue): Promise<void> {
    return this.httpRequest(path, payload);
  }
  private async httpRequest(path: string, payload: JsonValue) {
    const host = this.configService.get(HOST_VAR);
    const secret = this.configService.get(SECRET_VAR);
    const token = this.jwtService.sign(
      {},
      {
        expiresIn: EXPIRES_IN,
        secret
      }
    );
    await this.httpService
      .post(`${host}${path}`, payload, {
        headers: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          Authorization: `Bearer ${token}`
        }
      })
      .toPromise();
  }
}
