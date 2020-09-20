import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JsonValue } from 'type-fest';

const HOST_VAR = 'HOST';

@Injectable()
export class BackgroundService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}
  async queue(path: string, payload: JsonValue): Promise<void> {
    return this.httpRequest(path, payload);
  }
  private async httpRequest(path: string, payload: JsonValue) {
    const host = this.configService.get(HOST_VAR);
    await this.httpService.post(`${host}${path}`, payload).toPromise();
  }
}
