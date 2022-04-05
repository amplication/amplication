import { Injectable } from '@nestjs/common';
import { compare, Options } from 'dir-compare';
import { join } from 'path';
import { ChangedFile } from '@amplication/common/src/dto/ChangedFile';
import { BuildPathFactory } from './utils/BuildPathFactory';
import { sync } from 'fast-glob';

@Injectable()
export class DiffService {
  constructor(private readonly buildsPathFactory: BuildPathFactory) {}
  async listOfChangedFiles(
    amplicationAppId: string,
    previousAmplicationBuildId: string,
    newAmplicationBuildId: string
  ): Promise<ChangedFile[]> {
    const oldBuildPath = this.buildsPathFactory.get(
      amplicationAppId,
      previousAmplicationBuildId
    );
    const newBuildPath = this.buildsPathFactory.get(
      amplicationAppId,
      newAmplicationBuildId
    );

    if (oldBuildPath === newBuildPath) {
      throw new Error('Cant get the same build id');
    }
    try {
      const res = await compare(oldBuildPath, newBuildPath, compareOptions);
      const changedFiles = res.diffSet.filter((diff) => {
        if (diff.state !== 'equal') {
          return true;
        }
        return false;
      });
      return (
        changedFiles
          // Remove all the old deleted files
          .filter((diff) => diff.name2)
          .map((diff) => ({
            path: join(diff.relativePath, diff.name2),
          }))
      );
    } catch (error) {
      const files = sync(`${newBuildPath}/**`).map((file) => ({
        path: file,
      }));
      return files;
    }
  }
}

const compareOptions: Options = {
  compareContent: true,
  compareDate: false,
  compareSize: false,
  compareSymlink: false,
};
