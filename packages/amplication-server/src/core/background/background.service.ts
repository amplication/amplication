import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { JsonValue } from 'type-fest';

const HOST_VAR = 'HOST';

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
    const token = this.jwtService.sign({});
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
