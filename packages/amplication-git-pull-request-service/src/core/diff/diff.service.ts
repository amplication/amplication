import {
  AmplicationLogger,
  AMPLICATION_LOGGER_PROVIDER,
} from '@amplication/nest-logger-module';
import { Inject, Injectable } from '@nestjs/common';
import assert from 'assert';
import { compare, DiffSet } from 'dir-compare';
import { sync } from 'fast-glob';
import { existsSync, readFileSync } from 'fs';
import { join, normalize } from 'path';
import { PrModule } from '../../constants';
import { BuildPathFactory } from './utils/BuildPathFactory';

@Injectable()
export class DiffService {
  constructor(
    private readonly buildsPathFactory: BuildPathFactory,
    @Inject(AMPLICATION_LOGGER_PROVIDER)
    private readonly logger: AmplicationLogger
  ) {}
  async listOfChangedFiles(
    resourceId: string,
    previousAmplicationBuildId: string | undefined,
    newAmplicationBuildId: string
  ): Promise<PrModule[]> {
    const newBuildPath = this.buildsPathFactory.get(
      resourceId,
      newAmplicationBuildId
    );
    // return all the new files if an old build folder dont exist
    if (!previousAmplicationBuildId) {
      return this.firstBuild(newBuildPath);
    }
    const oldBuildPath = this.buildsPathFactory.get(
      resourceId,
      previousAmplicationBuildId
    );
    this.logger.info('List of the paths', {
      resourceId,
      previousAmplicationBuildId,
      newAmplicationBuildId,
    });
    assert.notStrictEqual(
      oldBuildPath,
      newBuildPath,
      'Cant get the same build id'
    );

    DiffService.assertBuildExist(oldBuildPath);
    DiffService.assertBuildExist(newBuildPath);

    this.logger.info({ oldBuildPath, newBuildPath });

    const res = await compare(oldBuildPath, newBuildPath, {
      compareContent: true,
      compareDate: false,
      compareSize: false,
      compareSymlink: false,
    });

    this.logger.debug('Finish the dir-compare lib process');
    if (!res?.diffSet) {
      throw new Error('');
    }
    // const changedFiles = res?.diffSet?.filter((diff) => {
    //   if (diff.state !== 'equal' && diff.type2 === 'file') {
    //     //make sure that only new files enter and ignore old files
    //     if (diff.state !== 'left') {
    //       return true;
    //     }
    //   }
    //   return false;
    // });
    const removedFiles = DiffService.removedFiles(res.diffSet);
    // this.logger.info('The list of the changed files', { changedFiles });
    // if (!changedFiles) {
    //   throw new Error("Didn't have changed files");
    // }
    const removedModules = removedFiles.map(({ name1, relativePath }) => {
      if (!name1) {
        throw new Error("Didn't have name1");
      }
      const path = join(relativePath, name1);

      return {
        path: path,
        code: null,
      };
    });
    // const modules = changedFiles.map(async ({ name2, path2, relativePath }) => {
    //   if (!name2 || !path2) {
    //     throw new Error("Didn't got valid props");
    //   }
    //   const path = join(relativePath, name2);
    //   const code = await readFileSync(join(path2, name2)).toString('utf8');
    //   return {
    //     path,
    //     code,
    //   };
    // });
    const resultModule = await Promise.all([
      /*...modules,*/ ...(await this.firstBuild(newBuildPath)),
      ...removedModules,
    ]);
    return resultModule;
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

  private static removedFiles(diff: DiffSet): DiffSet {
    return diff.filter((diff) => {
      if (
        diff.state === 'left' &&
        diff.type2 === 'missing' &&
        diff.type1 !== 'directory'
      ) {
        return true;
      }
      return false;
    });
  }
}
