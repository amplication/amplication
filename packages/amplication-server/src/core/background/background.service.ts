import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const HOST_VAR = 'HOST';

@Injectable()
export class BackgroundService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {}
  async queue(path: string, payload: any): Promise<void> {
    const host = this.configService.get(HOST_VAR);
    await this.httpService.post(`${host}${path}`, payload).toPromise();
  }
}
