import {
  AmplicationLogger,
  AMPLICATION_LOGGER_PROVIDER,
} from '@amplication/nest-logger-module';
import { Inject, Injectable } from '@nestjs/common';
import assert from 'assert';
import { compare } from 'dir-compare';
import { sync } from 'fast-glob';
import { existsSync, readFileSync } from 'fs';
import { normalize } from 'path';
import { PrModule } from '../../constants';
import { mapDiffSetToPrModule } from './diffset-mapper';
import { BuildPathFactory } from './utils/BuildPathFactory';
import { deleteFilesVisitor } from './visitors/delete-files';

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
    // If an old build folder does not exist, we return all new files
    if (!previousAmplicationBuildId) {
      return this.getAllModulesForPath(newBuildPath);
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

    const res = await compare(oldBuildPath, newBuildPath, {
      compareContent: true,
      compareDate: false,
      compareSize: false,
      compareSymlink: false,
      skipEmptyDirs: true,
    });

    this.logger.debug('Finish the dir-compare lib process');

    if (!res?.diffSet) {
      throw new Error('Error in creating a diff set');
    }

    const modules = mapDiffSetToPrModule(res.diffSet, [deleteFilesVisitor]);

    const resultModule = await Promise.all([
      ...(await this.getAllModulesForPath(newBuildPath)),
      ...modules,
    ]);
    return resultModule;
  }

  private async getAllModulesForPath(buildPath: string) {
    const basePathLength = buildPath.length;
    const files = sync(`${buildPath}/**`, { dot: true }).map(
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
