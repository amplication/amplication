import { join, normalize } from "path";
import { v4 } from "uuid";
import { MissingEnvParam } from "../errors/MissingEnvParam";

interface CloneDirParams {
  owner: string;
  repositoryName: string;
}

export const CLONES_FOLDER_ENV = "CLONES_FOLDER";

export function getCloneDir({ owner, repositoryName }: CloneDirParams) {
  const cloneFolder = process.env.CLONES_FOLDER;

  if (!cloneFolder) {
    throw new MissingEnvParam(CLONES_FOLDER_ENV);
  }

  const cloneDir = normalize(
    join(cloneFolder, this.provider.name, owner, repositoryName, v4())
  );

  return cloneDir;
}
