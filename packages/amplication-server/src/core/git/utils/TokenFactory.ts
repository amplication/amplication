import { INVALID_APP_ID } from '../../../core/app/app.service';
import { AppService } from '../../../core';
import { isEmpty } from 'lodash';

/**
 *
 */
export class TokenFactory {
  constructor(private appService: AppService) {}
  async getTokenFromApp(appId: string): Promise<string> {
    const app = await this.appService.app({ where: { id: appId } });

    if (isEmpty(app)) {
      throw new Error(INVALID_APP_ID);
    }

    if (isEmpty(app.githubToken)) {
      throw new Error(
        `App Missing a Github token. You should first complete the authorization process`
      );
    }
    return app.githubToken;
  }
}
