import { Module } from '@amplication/common';
import { Injectable } from '@nestjs/common';
import assert from 'assert';
import { compare } from 'dir-compare';
import { sync } from 'fast-glob';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { BuildPathFactory } from './utils/BuildPathFactory';

export const SAME_FOLDER_ERROR = 'Cant get the same build id';

@Injectable()
export class DiffService {
  constructor(private readonly buildsPathFactory: BuildPathFactory) {}
  async listOfChangedFiles(
    amplicationAppId: string,
    previousAmplicationBuildId: string,
    newAmplicationBuildId: string
  ): Promise<Module[]> {
    const oldBuildPath = this.buildsPathFactory.get(
      amplicationAppId,
      previousAmplicationBuildId
    );
    const newBuildPath = this.buildsPathFactory.get(
      amplicationAppId,
      newAmplicationBuildId
    );

    assert.notStrictEqual(oldBuildPath, newBuildPath, SAME_FOLDER_ERROR);

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
    const files = sync(`${newBuildPath}/**`).map(async (file) => {
      const code = await readFileSync(file).toString('utf8');
      return {
        path: file,
        code,
      };
    });
    return await Promise.all(files);
  }
}
