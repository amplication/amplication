import { ITokenExtractor } from '../../../git/contracts/ITokenExtractor';
import { isEmpty } from 'lodash';
import { AmplicationError } from 'src/errors/AmplicationError';
import { MISSING_TOKEN_ERROR } from '../../../git/constants';
import { AppService } from '../../..';
import { forwardRef, Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GithubTokenExtractor implements ITokenExtractor {
  constructor(
    @Inject(forwardRef(() => AppService))
    private readonly appService: AppService
  ) {}
  async getTokenFromDb(appId: string): Promise<string> {
    const app = await this.appService.app({ where: { id: appId } });
    if (isEmpty(app)) {
      throw new AmplicationError('Invalid appId');
    }
    if (isEmpty(app.githubToken)) {
      throw new AmplicationError(MISSING_TOKEN_ERROR);
    }
    return app.githubToken;
  }
}
