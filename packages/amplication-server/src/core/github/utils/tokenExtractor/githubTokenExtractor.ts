import { Injectable } from '@nestjs/common';
import { isEmpty } from 'lodash';
import { PrismaService } from 'nestjs-prisma';
import { AmplicationError } from 'src/errors/AmplicationError';
import { MISSING_TOKEN_ERROR } from '../../../git/constants';
import { ITokenExtractor } from '../../../git/contracts/ITokenExtractor';

@Injectable()
export class GithubTokenExtractor implements ITokenExtractor {
  constructor(private readonly prismaService: PrismaService) {}
  async getTokenFromDb(appId: string): Promise<string> {
    const app = await this.prismaService.app.findUnique({
      where: { id: appId }
    });
    if (isEmpty(app)) {
      throw new AmplicationError('Invalid appId');
    }
    if (isEmpty(app.githubToken)) {
      throw new AmplicationError(MISSING_TOKEN_ERROR);
    }
    return app.githubToken;
  }
}
