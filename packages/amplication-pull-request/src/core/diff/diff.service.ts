import { Injectable } from '@nestjs/common';
import { compare, Options } from 'dir-compare';
import { join } from 'path';
import { ChangedFile } from '@amplication/common/src/dto/ChangedFile';
import { BuildPathFactory } from './utils/BuildPathFactory';
import { sync } from 'fast-glob';
import { existsSync } from 'fs';
import assert from 'assert';
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

    assert.notEqual(oldBuildPath, newBuildPath, 'Cant get the same build id');

    // return all the new files if an old build folder dont exist
    if (existsSync(oldBuildPath) === false) {
      return this.firstBuild(newBuildPath);
    }

    const res = await compare(oldBuildPath, newBuildPath, {
      compareContent: true,
      compareDate: false,
      compareSize: false,
      compareSymlink: false,
    });
    const changedFiles = res.diffSet.filter((diff) => {
      if (diff.state !== 'equal') {
        //make sure that only new files enter and ignore old files
        if (diff.state !== 'left') {
          return true;
        }
      }
      return false;
    });
    return changedFiles.map((diff) => ({
      path: join(diff.relativePath, diff.name2),
    }));
  }

  private firstBuild(newBuildPath: string) {
    const files = sync(`${newBuildPath}/**`).map((file) => ({
      path: file,
    }));
    return files;
  }
}
