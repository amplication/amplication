import { isEmpty } from 'lodash';
import { AmplicationError } from 'src/errors/AmplicationError';
import { AppService } from '../../../../core';
import { INVALID_APP_ID } from '../../../../core/app/app.service';

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
      throw new AmplicationError(MISSING_TOKEN_ERROR);
    }
    return app.githubToken;
  }
}

export const MISSING_TOKEN_ERROR = `App Missing a Github token. You should first complete the authorization process`;
