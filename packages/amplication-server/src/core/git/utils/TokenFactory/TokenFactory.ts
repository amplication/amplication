import { INVALID_APP_ID } from '../../../../core/app/app.service';
import { AppService } from '../../../../core';
import { isEmpty } from 'lodash';
import { MISSING_TOKEN_ERROR } from './MissingTokenError';

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
      throw MISSING_TOKEN_ERROR;
    }
    return app.githubToken;
  }
}
