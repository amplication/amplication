import {
  AmplicationLogger,
  AMPLICATION_LOGGER_PROVIDER,
} from '@amplication/nest-logger-module';
import { Inject, Injectable } from '@nestjs/common';
import assert from 'assert';
import { compare } from 'dir-compare';
import { sync } from 'fast-glob';
import { existsSync, readFileSync } from 'fs';
import { join, normalize } from 'path';
import { BuildPathFactory } from './utils/BuildPathFactory';

@Injectable()
export class DiffService {
  constructor(
    private readonly buildsPathFactory: BuildPathFactory,
    @Inject(AMPLICATION_LOGGER_PROVIDER)
    private readonly logger: AmplicationLogger
  ) {}
  async listOfChangedFiles(
    amplicationAppId: string,
    previousAmplicationBuildId: string,
    newAmplicationBuildId: string
  ): Promise<{ path: string; code: string }[]> {
    const oldBuildPath = this.buildsPathFactory.get(
      amplicationAppId,
      previousAmplicationBuildId
    );
    const newBuildPath = this.buildsPathFactory.get(
      amplicationAppId,
      newAmplicationBuildId
    );
    this.logger.info('List of the paths', {
      appId: amplicationAppId,
      previousAmplicationBuildId,
      newAmplicationBuildId,
    });
    assert.notStrictEqual(
      oldBuildPath,
      newBuildPath,
      'Cant get the same build id'
    );

    //This line added as a hotfix to https://github.com/amplication/amplication/issues/2878
    return this.firstBuild(newBuildPath);

    // return all the new files if an old build folder dont exist
    if (existsSync(oldBuildPath) === false) {
      return this.firstBuild(newBuildPath);
    }

    DiffService.assertBuildExist(newBuildPath);

    this.logger.info({ oldBuildPath, newBuildPath });

    const res = await compare(oldBuildPath, newBuildPath, {
      compareContent: true,
      compareDate: false,
      compareSize: false,
      compareSymlink: false,
    });

    this.logger.debug('Finish the dir-compare lib process');

    const changedFiles = res.diffSet.filter((diff) => {
      if (diff.state !== 'equal' && diff.type2 === 'file') {
        //make sure that only new files enter and ignore old files
        if (diff.state !== 'left') {
          return true;
        }
      }
      return false;
    });

    this.logger.info('The list of the changed files', { changedFiles });

    const modules = changedFiles.map(async (diff) => {
      const path = join(diff.relativePath, diff.name2);
      const code = await readFileSync(join(diff.path2, diff.name2)).toString(
        'utf8'
      );
      return {
        path,
        code,
      };
    });

    return await Promise.all(modules);
  }

  private async firstBuild(newBuildPath: string) {
    const basePathLength = newBuildPath.length;
    const files = sync(`${newBuildPath}/**`, { dot: true }).map(
      async (fullPath) => {
        const path = normalize(fullPath.slice(basePathLength));
        const code = await readFileSync(fullPath).toString('utf8');
        return {
          path,
          code,
        };
      }
    );
    return await Promise.all(files);
  }

  private static assertBuildExist(buildPath) {
    assert(existsSync(buildPath));
  }
}
